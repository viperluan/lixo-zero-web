type ClassValue = string | false | null | undefined;

/**
 * Junta classes condicionais. Substitui o `classnames` do reactstrap sem
 * adicionar dependencia nova ao projeto.
 */
const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ');

export { cn };
