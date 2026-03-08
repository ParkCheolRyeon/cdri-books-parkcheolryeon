import type { ButtonHTMLAttributes } from "react";
import styled from "@emotion/styled";

type ButtonVariant = "primary" | "red" | "gray" | "ghost";
type ButtonSize = "full" | "lg" | "md" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
}>(({ theme, $variant, $size }) => {
  const variantStyles = {
    primary: {
      backgroundColor: theme.color.primary,
      color: theme.color.white,
      hover: { opacity: 0.9 },
    },
    red: {
      backgroundColor: theme.color.red,
      color: theme.color.white,
      hover: { opacity: 0.9 },
    },
    gray: {
      backgroundColor: theme.color.lightgray,
      color: theme.textColor.secondary,
      hover: { backgroundColor: theme.color.gray },
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.textColor.primary,
      hover: { backgroundColor: theme.color.lightgray },
    },
  } as const;

  const sizeStyles = {
    full: { width: "100%" },
    lg: {},
    md: {},
    sm: {},
  } as const;

  return {
    gap: 8,
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
    color: variantStyles[$variant].color,
    fontSize: theme.typography.body2.size,
    "&:hover": variantStyles[$variant].hover,
    fontWeight: theme.typography.body2.weight,
    lineHeight: theme.typography.body2.lineHeight,
    transition: "background-color 200ms ease, opacity 200ms ease",
    backgroundColor: variantStyles[$variant].backgroundColor,

    ...sizeStyles[$size],

    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  };
});

export function Button(props: ButtonProps) {
  const { size = "md", type = "button", variant = "primary", ...rest } = props;

  return <StyledButton type={type} $size={size} $variant={variant} {...rest} />;
}
