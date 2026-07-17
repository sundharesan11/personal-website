export interface IdleSunflowerController {
  activity(): void;
  destroy(): void;
}

interface IdleSunflowerOptions {
  onShow: (count: 2 | 3) => void;
  onClear: () => void;
  idleMs?: number;
  reducedMotion?: boolean;
  random?: () => number;
}

export function createIdleSunflowerController({
  onShow,
  onClear,
  idleMs = 3000,
  reducedMotion = false,
  random = Math.random,
}: IdleSunflowerOptions): IdleSunflowerController {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let destroyed = false;

  const schedule = () => {
    if (destroyed || reducedMotion) return;
    timer = setTimeout(() => {
      timer = undefined;
      onShow(random() < 0.5 ? 2 : 3);
    }, idleMs);
  };

  const activity = () => {
    if (destroyed || reducedMotion) return;
    if (timer) clearTimeout(timer);
    timer = undefined;
    onClear();
    schedule();
  };

  schedule();

  return {
    activity,
    destroy() {
      destroyed = true;
      if (timer) clearTimeout(timer);
      timer = undefined;
    },
  };
}
