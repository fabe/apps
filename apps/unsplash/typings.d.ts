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

        };
    };
}

type AppConfig = TargetStateConfig | false;