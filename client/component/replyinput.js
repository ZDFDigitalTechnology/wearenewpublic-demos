import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useState } from "react";
import { AutoSizeTextInput, Card, PrimaryButton, SecondaryButton } from "./basics";
import { CommentContext } from "./comment";
import { gotoLogin } from "../util/navigate";
import { useDatastore, usePersonaKey } from "../util/datastore";
import { useTranslation } from "./translation";

export function ReplyInput({commentKey=null, topLevel = false, topPad=true}) {
    const personaKey = usePersonaKey();
    const datastore = useDatastore();
    const [post, setPost] = useState({text: '', replyTo: commentKey});
    const {postHandler, authorFace, getCanPost, commentPlaceholder, replyWidgets, replyTopWidgets} = useContext(CommentContext);
    const s = ReplyInputStyle;

    const placeholderText = useTranslation(commentPlaceholder);

    function onPost() {
        if (postHandler) {
            postHandler({datastore, post});
        } else {
            datastore.addObject('comment', post);
        }
        if (topLevel) {
            setPost({text: '', replyTo: commentKey});
        } else {
            hideReplyInput();
        }
    }

    function hideReplyInput() {
        setPost({text: '', replyTo: commentKey})
        datastore.setSessionData('replyToComment', null);
    }

    if (!personaKey) {
        return <View style={{marginTop: topPad ? 16 : 0}}><LoginToComment /></View>
    }

    return <View style={[s.row, topPad ? {marginTop: 16} : null]}>
        {React.createElement(authorFace, {comment: {from: personaKey}})}
        <View style={s.right}>
            {(replyTopWidgets.length > 0) ?
                <View style={s.widgetBar}>
                    {replyTopWidgets.map((widget, idx) => 
                        React.createElement(widget, {key: idx, replyTo: commentKey, post, onPostChanged:setPost})
                    )}
                </View>
            : null}
            <AutoSizeTextInput style={s.textInput}
                placeholder={placeholderText}
                placeholderTextColor='#999'
                value={post.text}
                onChangeText={text => setPost({...post, text})}
                multiline={true}
            />
            {(!topLevel || post.text) ?
                <View style={s.widgetBar}>
                    {replyWidgets.map((widget, idx) => 
                        React.createElement(widget, {key: idx, replyTo: commentKey, post, onPostChanged:setPost})
                    )}
                </View>
            : null}
            {(!topLevel || getCanPost({datastore,post})) ? 
                <View style={s.actions}>
                    <PrimaryButton onPress={onPost} label='Post'/>
                    <SecondaryButton onPress={hideReplyInput} label='Cancel' />
                </View>
            : null}
        </View>
    </View>
}

const ReplyInputStyle = StyleSheet.create({
    textInput: {
        flex: 1,
        borderRadius: 8, 
        borderWidth: StyleSheet.hairlineWidth, 
        borderColor: '#ddd', padding: 8,
        marginHorizontal: 8,
        fontSize: 15, lineHeight: 20,
        height: 150,
    },
    textInputWrapper: {
        height: 150,
    },
    right: {
        flex: 1,
        maxWidth: 500
    },
    row: {
        flexDirection: 'row',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8,
    },
    widgetBar: {
        marginLeft: 8,
        marginBottom: 8,
    }
})

export function TopCommentInput({about = null}) {
    return ReplyInput({commentKey: about, topLevel: true});
}

export function PostInput({placeholder = "What\'s on your mind?", postHandler=null, topWidgets=[], getCanPost=null}) {
    const commentContext = useContext(CommentContext);
    function defaultPostHandler({datastore, post}) {
        datastore.addObject('post', post)
    }
    return <CommentContext.Provider value={{...commentContext, postHandler: postHandler ?? defaultPostHandler, 
                commentPlaceholder:placeholder, replyTopWidgets: topWidgets, 
                getCanPost: getCanPost ?? commentContext.getCanPost}}>
        <Card>
            <ReplyInput topLevel topPad={false} />
        </Card>
    </CommentContext.Provider>
}


function LoginToComment() {
    return <PrimaryButton onPress={gotoLogin} label='Log in to comment' />
}