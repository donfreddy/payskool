import * as React from 'react'
import { cn } from '@ui/lib/utils'
import { Card, CardContent } from '@ui/components/ui/card'

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number   // e.g. +12.5 or -3.2
    label?: string  // e.g. "vs last month"
  }
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const variantStyles = {
  default: 'border-payskool-border',
  success: 'border-l-4 border-l-payskool-emerald',
  warning: 'border-l-4 border-l-payskool-orange',
  danger:  'border-l-4 border-l-destructive',
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, subtitle, trend, icon, variant = 'default', ...props }, ref) => {
    const isPositive = (trend?.value ?? 0) >= 0

    return (
      <Card
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
              {trend && (
                <p
                  className={cn(
                    'mt-1 text-xs font-medium',
                    isPositive ? 'text-payskool-emerald' : 'text-payskool-orange',
                  )}
                >
                  {isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                  {trend.label && (
                    <span className="ml-1 font-normal text-muted-foreground">{trend.label}</span>
                  )}
                </p>
              )}
            </div>
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-5">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  },
)
StatCard.displayName = 'StatCard'

export { StatCard }
