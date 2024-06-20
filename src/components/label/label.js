export default function Label({ children, type, Icon, className, ...props }) {
    // Default
    let classes = `badge py-4 gap-2 ${className}`;

    // Profile
    if(type === 'profile'){
        classes = `flex gap-2 items-center text-sm  ${className}`
    }

    if(type === 'danger'){
        classes = `badge badge-error py-4 px-4 ${className}`
    }

    if(type === 'success'){
        classes = `badge badge-success py-4 px-4 text-white ${className}`
    }
    if(type === 'warning'){
        classes = `badge badge-warning py-4 px-4 ${className}`
    }
 
    return <label className={classes} {...props}>{Icon && <Icon className="size-5 dark:text-zinc-200" />} {children}</label>
}
