interface Target {
  target: string;
}

interface Transport {
  transport: Target;
}

interface Opts {
  logger: Transport | boolean;
}

export type { Opts };
