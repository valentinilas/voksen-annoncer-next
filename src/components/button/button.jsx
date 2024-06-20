import Link from "next/link";

export default function Button({ children, type, className, to, href, variant = "primary", size = "m", Icon, iconDirection = "left", ...props }) {

    // Variants: Primary, Secondary, Tertiary
    // Sizes: S, M, L
    // Icons: Start, End

    // Default
    let classes = `cursor-pointer rounded-full font-medium	 flex gap-2 justify-items-center items-center transition-colors duration-300 border-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`

    // Size
    let sizeClasses;
    let iconClasses = "transition-colors duration-300";
    switch (size) {
        case 's':
            sizeClasses = ' px-4 py-1 text-sm';
            iconClasses += ' size-3'
            break;
        case 'm':
            sizeClasses = ' px-5 py-2 text-base';
            iconClasses += ' size-5'
            break;
        case 'l':
            sizeClasses = ' px-6 py-2 text-lg';
            iconClasses += ' size-5'
            break;


        case 's-icon-only':
            sizeClasses = ' px-2 py-2';
            iconClasses += ' size-3'
            break;
        case 'm-icon-only':
            sizeClasses = ' px-3 py-3';
            iconClasses += ' size-5'
            break;
        case 'l-icon-only':
            sizeClasses = ' px-4 py-4';
            iconClasses += ' size-5'
            break;


    }

    classes += sizeClasses;

    // Variant
    let variantClasses = '';

    switch (variant) {
        case 'primary':
            variantClasses = ' bg-cherry-600 border-transparent  text-white hover:bg-cherry-800';
            iconClasses += ' text-white';
            break;
        case 'secondary':
            variantClasses = ' group  bg-transparent border-solid border-2 border-cherry-600 text-cherry-600 hover:bg-cherry-600 hover:text-white';
            iconClasses += ' text-cherry-600 group-hover:text-white';
            break;
        case 'tertiary':
            variantClasses = ' bg-transparent border-transparent text-cherry-600 hover:bg-cherry-900/10 ';
            iconClasses += ' text-cherry-600';
            break;
        case 'text':
            variantClasses = ' bg-transparent border-transparent text-cherry-600 hover:text-cherry-600';
            iconClasses += ' text-cherry-600';
            break;

    }

    classes += variantClasses;


    // Icon

    if (iconDirection === "right") {
        classes += ' flex-row-reverse'
    }



    const Element = to ? Link : href ? 'a' : 'button';
    const elementProps = to ? { ...props, href: to } : href ? { ...props, href } : { ...props, type: type || 'button' };

    return (
        <Element className={classes} {...elementProps}>
            {Icon && <Icon className={iconClasses} />}
            {children}
        </Element>
    );
}