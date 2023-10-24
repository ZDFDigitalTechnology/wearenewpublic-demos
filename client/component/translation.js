import { useContext } from "react";
import { ui_translations_french } from "../translations/french/ui_french";
import { ui_translations_german } from "../translations/german/ui_german";
import { PrototypeContext } from "../organizer/PrototypeContext";
import { Text } from "react-native";
import { formatString } from "../util/util";
import { useGlobalProperty } from "../util/datastore";
import { useFirebaseData } from "../util/firebase";

export const languageEnglish = 'English';
export const languageGerman = 'German';
export const languageFrench = 'French';

const ui_translations_for_language = {
    German: ui_translations_german,
    French: ui_translations_french
}

export function translateLabel({label, language, formatParams}) {
    var extra = {};
    if (formatParams?.singular && formatParams?.plural && formatParams?.count) {
        if (formatParams.count == 1) {
            extra = {noun: translateLabel({label: formatParams.singular, language})}
        } else {
            extra = {noun: translateLabel({label: formatParams.plural, language})}
        }
    }
    const translations = ui_translations_for_language[language];
    var translatedText = translations ? translations[label] : label;

    if (!translatedText && language != languageEnglish && language) {
        console.log('No translation for ' + label + ' in ' + language);
    }
    if (formatParams) {
        translatedText = formatString(translatedText || label, {...formatParams, ...extra});
    }
    return translatedText || label;
}

export function translatePlural({singular, plural, language, count}) {
    if (count == 1) {
        return count + ' ' + translateLabel({label: singular, language});
    } else {
        return count + ' ' + translateLabel({label: plural, language});
    }
}

export function useLanguage() {
    const {prototypeKey, instanceKey, instance} = useContext(PrototypeContext);    
    const globalLanguage = useFirebaseData(['prototype', prototypeKey, 'instance', instanceKey, 'global', 'language']);

    if (!instance) {
        return null;
    } else if (!instance?.isLive || instance?.language) {
        return instance.language;
    } else {
        return globalLanguage;
    }
}

export function useTranslation(label, formatParams) {
    const language = useLanguage();
    if (label == null) return null;
    return translateLabel({label, language, formatParams});
}

export function TranslatableLabel({label, formatParams, style, ...props}) {
    try {
        const translatedLabel = useTranslation(label, formatParams);
        return <Text style={style} {...props}>{translatedLabel || label}</Text>
    } catch (e) {
        console.log('Error translating ' + label, e);
        throw Error('Error translating ' + label + ': ' + e);
        // return <Text style={style} {...props}>{label}</Text>
    }
}

export function TranslatableText({text, label, formatParams, style, ...props}) {
    try {
        const translatedLabel = useTranslation(label, formatParams);
        return <Text style={style} {...props}>{translatedLabel || label || text}</Text>
    } catch (e) {
        console.log('Error translating ' + label, e);
        throw Error('Error translating ' + label + ': ' + e);
        // return <Text style={style} {...props}>{label}</Text>
    }
}

