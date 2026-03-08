import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as RadixAccordion from "@radix-ui/react-accordion";

type AccordionRootProps = ComponentPropsWithoutRef<typeof RadixAccordion.Root>;
type AccordionItemProps = ComponentPropsWithoutRef<typeof RadixAccordion.Item>;
type AccordionHeaderProps = ComponentPropsWithoutRef<
  typeof RadixAccordion.Header
>;
type AccordionTriggerProps = ComponentPropsWithoutRef<
  typeof RadixAccordion.Trigger
>;
type AccordionContentProps = ComponentPropsWithoutRef<
  typeof RadixAccordion.Content
>;

export function AccordionRoot({ className, ...props }: AccordionRootProps) {
  return <StyledAccordionRoot className={className} {...props} />;
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <StyledAccordionItem className={className} {...props} />;
}

export function AccordionHeader({ className, ...props }: AccordionHeaderProps) {
  return <StyledAccordionHeader className={className} {...props} />;
}

export function AccordionTrigger({
  className,
  ...props
}: AccordionTriggerProps) {
  return <StyledAccordionTrigger className={className} {...props} />;
}

export function AccordionContent({
  className,
  ...props
}: AccordionContentProps) {
  return <StyledAccordionContent className={className} {...props} />;
}

type AccordionProps = {
  value: string;
  trigger: ReactNode;
  children: ReactNode;
};

export function Accordion({ value, trigger, children }: AccordionProps) {
  return (
    <AccordionRoot type="single" collapsible>
      <AccordionItem value={value}>
        <AccordionHeader>
          <DefaultTrigger>{trigger}</DefaultTrigger>
        </AccordionHeader>
        <AccordionContent>
          <DefaultContentInner>{children}</DefaultContentInner>
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

const accordionDown = keyframes({
  from: {
    height: 0,
    opacity: 0,
  },
  to: {
    opacity: 1,
    height: "var(--radix-accordion-content-height)",
  },
});

const accordionUp = keyframes({
  from: {
    opacity: 1,
    height: "var(--radix-accordion-content-height)",
  },
  to: {
    height: 0,
    opacity: 0,
  },
});

const StyledAccordionRoot = styled(RadixAccordion.Root)({
  width: "100%",
});

const StyledAccordionItem = styled(RadixAccordion.Item)({
  width: "100%",
});

const StyledAccordionHeader = styled(RadixAccordion.Header)({});

const StyledAccordionTrigger = styled(RadixAccordion.Trigger)({
  transition: "background-color 200ms ease",
});

const StyledAccordionContent = styled(RadixAccordion.Content)({
  overflow: "hidden",
  '&[data-state="open"]': {
    animation: `${accordionDown} 200ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${accordionUp} 200ms ease-out`,
  },
});

const DefaultTrigger = styled(StyledAccordionTrigger)(({ theme }) => ({
  width: "100%",
  display: "flex",
  textAlign: "left",
  padding: "12px 16px",
  alignItems: "center",
  borderRadius: theme.radius.lg,
  color: theme.textColor.primary,
  justifyContent: "space-between",
  backgroundColor: theme.color.white,
  fontSize: theme.typography.body2Bold.size,
  border: `1px solid ${theme.color.borderSoft}`,
  fontWeight: theme.typography.body2Bold.weight,
  lineHeight: theme.typography.body2Bold.lineHeight,
  "&:hover": {
    backgroundColor: theme.color.lightgray,
  },
}));

const DefaultContentInner = styled.div({
  paddingTop: 16,
});
