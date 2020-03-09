import { EditorInterface } from 'contentful-ui-extensions-sdk';
import get from 'lodash.get';

export function findSelectedContentTypes(appId: string | undefined, editorInterfaces: EditorInterface[]): EditorInterface[] {
    if (!appId) {
        return [];
    }

    return editorInterfaces
        .filter(ei =>
        get(ei, ['sidebar'], []).some(item => {
            return item.widgetNamespace === 'app' && item.widgetId === appId;
        })
        )
        .map(ei => get(ei, ['sys', 'contentType', 'sys', 'id']))
        .filter(ctId => typeof ctId === 'string' && ctId.length > 0);
}
