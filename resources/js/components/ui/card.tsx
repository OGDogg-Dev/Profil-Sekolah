import React from 'react';
import { cn } from '@/lib/cn';

type CardElementProps = React.HTMLAttributes<HTMLDivElement>;

type CardHeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

type CardParagraphProps = React.HTMLAttributes<HTMLParagraphElement>;

const Card = React.forwardRef<HTMLDivElement, CardElementProps>(function Card(
    { className, ...props },
    ref,
) {
    return (
        <div ref={ref} className={cn('rounded-2xl border bg-white shadow', className)} {...props} />
    );
});

const CardHeader = React.forwardRef<HTMLDivElement, CardElementProps>(function CardHeader(
    { className, ...props },
    ref,
) {
    return <div ref={ref} className={cn('border-b px-6 pb-4 pt-6', className)} {...props} />;
});

const CardContent = React.forwardRef<HTMLDivElement, CardElementProps>(function CardContent(
    { className, ...props },
    ref,
) {
    return <div ref={ref} className={cn('px-6 py-4', className)} {...props} />;
});

const CardFooter = React.forwardRef<HTMLDivElement, CardElementProps>(function CardFooter(
    { className, ...props },
    ref,
) {
    return <div ref={ref} className={cn('flex items-center gap-2 px-6 pb-6 pt-4', className)} {...props} />;
});

const CardTitle = React.forwardRef<HTMLHeadingElement, CardHeadingProps>(function CardTitle(
    { className, ...props },
    ref,
) {
    return <h3 ref={ref} className={cn('text-lg font-semibold text-slate-900', className)} {...props} />;
});

const CardDescription = React.forwardRef<HTMLParagraphElement, CardParagraphProps>(function CardDescription(
    { className, ...props },
    ref,
) {
    return <p ref={ref} className={cn('text-sm text-slate-600', className)} {...props} />;
});

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
export default Card;
