import type { ElementType, PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type ContainerProps = PropsWithChildren<{
  as?: ElementType;
  className?: string;
  id?: string;
}>;

export function Container({ as: Component = 'div', className = '', id, children }: ContainerProps) {
  return (
    <Component id={id} className={cn('mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Component>
  );
}
