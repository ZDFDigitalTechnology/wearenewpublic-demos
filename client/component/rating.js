import { StyleSheet, Text, View } from "react-native";
import { BackgroundBar, Clickable, MaybeClickable } from "./basics";
import { TranslatableText } from "./translation";


export function RatingWithLabel({value, labelSet, editable=false, placeholder, onChangeValue}) {
    const s = RatingWithLabelStyle;
    const label = value ? labelSet[value - 1] : placeholder;
    return <View style={s.row}>
        <SpectrumRating value={value} editable={editable} onChangeValue={onChangeValue} />
        <TranslatableText style={s.name} text={label} />
    </View>
}

const RatingWithLabelStyle = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        color: '#666',
        fontSize: 14,
        marginLeft: 8
    }
})

const colors = ['#f00', '#fa0', '#ff0', '#af0', '#0f0']

export function SpectrumRating({value, editable, onChangeValue}) {
    const s = SpectrumRatingStyle;
    const ratings = [1,2,3,4,5];
    // const hues = [0, 30, 60, 90, 120];

    return <View style={s.outer}>
        {ratings.map(rating =>
            <MaybeClickable key={rating} isClickable={editable} 
                onPress={() => onChangeValue(rating)}>
                <SpectrumItem enabled={rating == value} color={colors[rating-1]}/>
            </MaybeClickable>
        )}
    </View>
}

function SpectrumItem({enabled, color}) {    
    if (enabled) {
        return <Dot size={20} color={color}  padSize={2} borderColor='#ccc' borderWidth={1} />
    } else {
        return <Dot size={10} color='#ccc' padSize={4} />
    }
}

const SpectrumRatingStyle = StyleSheet.create({
    outer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

function Dot({size, color, borderColor, borderWidth, padSize}) {
    return <View style={{borderColor, borderWidth, backgroundColor: color, width: size, height: size, borderRadius: size/2, margin: padSize}} />
}

export function RatingSummary({labelSet, ratingCounts, selection, onChangeSelection }) {
    const ratings = [1,2,3,4,5];
    const maxCount = Math.max(...ratingCounts);
    const totalCount = ratingCounts.reduce((a,b) => a+b, 0);
    return <View>
        {ratings.map(rating =>
            <RatingSummaryItem key={rating} label={labelSet[rating-1]} totalCount={totalCount} maxCount={maxCount} count={ratingCounts[rating-1]} rating={rating} selected={selection==rating} onChangeSelection={onChangeSelection} />
        )}
    </View>
}

// function BackgroundBar({count, maxCount}) {
//     const s = BarStyle;
//     return <View style={s.frame}>
//         <View style={[s.filled, {flex: count}]} />
//         <View style={[s.empty, {flex: Math.max(maxCount, 4) - count}]} />
//     </View>
// }
// const BarStyle = StyleSheet.create({
//     frame: {
//         position: 'absolute',
//         left: 0,
//         top: 0,
//         right: 0,
//         bottom: 0,
//         zIndex: -1,
//         flexDirection: 'row',
//         borderRadius: 10,
//     },
//     filled: {
//         backgroundColor: '#77C7F6',
//         borderRadius: 4,
//     },
//     empty: {
//     }
// });

function RatingSummaryItem({label, totalCount, maxCount, count, rating, selected, onChangeSelection}) {
    const s = RatingSummaryItemStyle;
    function onSelect() {
        if (selected) {
            onChangeSelection(null);
        } else {
            onChangeSelection(rating);
        }
    }
    const barWidth = (count / Math.max(maxCount, 10)) * 400
    return <Clickable onPress={onSelect}>
        <View style={selected ? s.selectedRow : s.row}>
            <View style={s.dot}>
                <SpectrumItem enabled color={colors[rating-1]}/>
            </View>
            <View style={s.right}>
                <TranslatableText style={s.label} text={label}/>
                <Text style={s.count}>{count}</Text>
                <BackgroundBar count={count} maxCount={maxCount} />
            </View>
            {/* <View style={[s.ratingBar, {width: barWidth}]} /> */}
        </View>
    </Clickable>
}

const RatingSummaryItemStyle = StyleSheet.create({
    ratingBar: {
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        backgroundColor: '#ccc',
    },
    right: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        marginVertical: 4,
        marginLeft: 8
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    selectedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: 12,
        paddingHorizontal: 4,
        paddingVertical: 4
    },
    dot: {
        width: 24, height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: '#222',
        fontSize: 14,
        marginLeft: 8
    },
    count: {
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8
    }
})