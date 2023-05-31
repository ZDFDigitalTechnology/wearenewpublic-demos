
import React from 'react';
import { PrototypeContext } from '../../shared/PrototypeContext';
import { prototypes } from '..';
import { resetData } from '../../util/localdata';
import TestRenderer from 'react-test-renderer'; // ES6
import { act } from 'react-dom/test-utils';
import { forEachAsync } from '../../shared/util';
import { ChatPrototype } from '../Chat';


test.skip('Chat renders correctly', async () => {
    const prototype = ChatPrototype;
    const instance = prototype.instance[0];
    await renderPrototypeInstanceAsync({prototype, instance});
});

test('All prototype instances render correctly', async () => {
    await forEachAsync(prototypes, async prototype => {
        await forEachAsync(prototype.instance, async instance => {
            await renderPrototypeInstanceAsync({prototype, instance});
        });
    });
});

async function renderPrototypeInstanceAsync({prototype, instance}) {
    resetData(instance);
    await act(async () => {
        const renderer = await TestRenderer.create(
            <PrototypeContext.Provider value={{prototype, instance, instanceKey: instance.key}}>
                <prototype.screen />
            </PrototypeContext.Provider>
        );    
        await renderer.unmount();
    })
}

