import { ScrollView } from "react-native"
import { Pad, WideScreen } from "../component/basics";
import { Comment } from "../component/comment";
import { expandDataList } from "../shared/util"
import { useCollection } from "../util/localdata";
import { TopCommentInput } from "../component/replyinput";
import { ecorp, soccer, trek_vs_wars } from "../data/conversations";
import { statusStartingPoint, tagConversation } from "../data/tags";
import { authorRobEnnals } from "../data/authors";

const description = `
A starting point for future demos that involve threaded comments.

In this example, each comment can have other comments that appear as replies to it.

It is easy for other demos to customize threaded comments to change what actions are available,
how they are sorted, and what additional "bling" is attached to them.
`

export const ThreadedCommentsDemo = {
    key: 'threadedcomments',
    name: 'Threaded Comments',
    author: authorRobEnnals,
    date: '2023-05-08',
    description,
    tags: [tagConversation],
    status: statusStartingPoint,
    screen: ThreadedScreen,
    instance: [
        {key: 'ecorp', name: 'E-Corp Alumni', comment: expandDataList(ecorp)},
        {key: 'soccer', name: 'Soccer Team', comment: expandDataList(soccer)},
        {key: 'wars', name: 'Star Wars vs Star Trek', comment: expandDataList(trek_vs_wars)},
    ]    
}

export function ThreadedScreen() {
    const comments = useCollection('comment', {sortBy: 'time', reverse: true});
    const topLevelComments = comments.filter(comment => !comment.replyTo);

    return (
        <WideScreen pad>
            <ScrollView>
                <Pad size={8} />
                <TopCommentInput />
                {topLevelComments.map(comment => 
                    <Comment key={comment.key} commentKey={comment.key} />
                )}
            </ScrollView>
        </WideScreen>
    )
}