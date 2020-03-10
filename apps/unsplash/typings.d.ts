interface ContentType {
    name: string;
    fields: {
        id: string;
        type: 'Object';
    }[];
    sys: {
        id: string;
    };
}

interface AppParameters {
    selectedContentTypeId: string;
}

interface TargetStateConfig {
    parameters: AppParameters;
    targetState: {
        EditorInterface: {
            [key: string]: {
                controls: {
                    fieldId: string;
                }[]
            }
        };
    };
}

type AppConfig = TargetStateConfig | false;