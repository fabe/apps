interface UnsplashParameters {
    selectedContentType: string;
}


interface ContentType {
    name: string;
    sys: {
        id: string;
    };
}

interface TargetStateConfig {
    parameters: UnsplashParameters;
    targetState: {
        EditorInterface: {

        };
    };
}

type AppConfig = TargetStateConfig | false;