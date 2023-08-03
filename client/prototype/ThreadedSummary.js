import { ScrollView, View } from "react-native"
import { BodyText, Card, Center, EditableText, Narrow, Pad, PrimaryButton, SmallTitleLabel, WideScreen } from "../component/basics";
import { Comment } from "../component/comment";
import { expandDataList } from "../util/util"
import { TopCommentInput } from "../component/replyinput";
import { ecorp, soccer, trek_vs_wars } from "../data/conversations";
import { authorRobEnnals } from "../data/authors";
import { useCollection, useDatastore, useGlobalProperty } from "../util/datastore";
import { callServerApiAsync } from "../util/servercall";
import { QuietSystemMessage } from "../component/message";
import { useState } from "react";

const description = `
Generate a summary of a threaded conversation. This summary could be shared externally.
`

export const ThreadedSummaryPrototype = {
    key: 'threadedsummary',
    name: 'Threaded Summary',
    author: authorRobEnnals,
    date: '2023-08-02',
    description,
    screen: ThreadedSummaryScreen,
    instance: [
        {key: 'wars', name: 'Star Wars vs Star Trek', 
        summary: 'Both are good',
            comment: expandDataList(trek_vs_wars)},
        {key: 'wars-split', name: 'Star Wars vs Star Trek (Split)', 
            split: true,
                comment: expandDataList(trek_vs_wars)},
    
    ],
    liveInstance: [
        {key: 'live', name: 'Live Conversation', comment: {}}
    ],
    newInstanceParams: [
        {key: 'split', name: 'Split', type: 'boolean', default: false}
    ]    
}

function SummaryEditor({property, name, prompt}) {
    const value = useGlobalProperty(property);
    const datastore = useDatastore();
    const [inProgress, setInprogress] = useState(false);
    const comments = useCollection('comment', {sortBy: 'time', reverse: true});

    async function computeSummary() {
        const commentsJSON = JSON.stringify(comments);
        setInprogress(true);
        const newSummary = await callServerApiAsync('chatgpt', 'chat', {promptKey: prompt, params: {commentsJSON}});
        datastore.setGlobalProperty(property, newSummary);
        setInprogress(false);
    }

    return <Card>
        <SmallTitleLabel label={name} />
        <Pad/>
        <EditableText value={value || ''} onChange={newValue => datastore.setGlobalProperty(property,newValue)} 
            placeholder={'Enter ' + name} />
        <Pad/>
        {inProgress ?
            <QuietSystemMessage label='Computing...' />
        :
            <PrimaryButton label={'Generate New ' + name} onPress={computeSummary} />
        }
    </Card>
}

export function ThreadedSummaryScreen() {
    const comments = useCollection('comment', {sortBy: 'time', reverse: true});
    const topLevelComments = comments.filter(comment => !comment.replyTo);
    const split = useGlobalProperty('split');

    return (
        <WideScreen pad>
            <ScrollView>
                <Narrow>
                    {split ? 
                        <View>
                            <SummaryEditor property='agree' name='Points of Agreement' prompt='agree_points' />
                            <SummaryEditor property='disagree' name='Points of Disagreement' prompt='disagree_points' />
                        </View>
                    :
                        <SummaryEditor property='summary' name='Conversation Summary' prompt='summary' />
                    }
                </Narrow>
                <Center>
                    <View>
                    <TopCommentInput />
                    {topLevelComments.map(comment => 
                        <Comment key={comment.key} commentKey={comment.key} />
                    )}
                    </View>
                </Center>
                <Pad size={24}/>
            </ScrollView>
        </WideScreen>
    )
}