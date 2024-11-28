interface Target {
  target: string;
}

interface Transport {
  transport: Target;
}

export interface Opts {
  logger: Transport | boolean;
}
