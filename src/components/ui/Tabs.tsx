import { motion } from "framer-motion";
import styled from "@emotion/styled";
import * as RadixTabs from "@radix-ui/react-tabs";
import { NavLink } from "react-router-dom";

export type TabItem = {
  value: string;
  label: string;
  href: string;
};

type TabsProps = {
  value: string;
  items: TabItem[];
};

export function Tabs({ value, items }: TabsProps) {
  return (
    <RadixTabs.Root value={value}>
      <TabsList>
        {items.map((item) => (
          <StyledNavLink key={item.value} to={item.href}>
            {({ isActive }) => (
              <RadixTabs.Trigger asChild value={item.value}>
                <TriggerLabel>
                  <LabelInner>
                    <LabelText>{item.label}</LabelText>
                    {isActive ? (
                      <ActiveIndicator
                        layoutId="tabs-active-indicator"
                        aria-hidden="true"
                        transition={{
                          damping: 34,
                          type: "spring",
                          stiffness: 420,
                        }}
                      />
                    ) : (
                      <InactiveIndicator aria-hidden="true" />
                    )}
                  </LabelInner>
                </TriggerLabel>
              </RadixTabs.Trigger>
            )}
          </StyledNavLink>
        ))}
      </TabsList>
    </RadixTabs.Root>
  );
}

const TabsList = styled(RadixTabs.List)({
  gap: 56,
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
});

const StyledNavLink = styled(NavLink)({
  width: "100%",
  outline: "none",
  color: "inherit",
  display: "block",
  textDecoration: "none",
});

const TriggerLabel = styled.span(({ theme }) => ({
  color: theme.textColor.primary,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const LabelInner = styled.span({
  gap: 4,
  minWidth: 96,
  display: "flex",
  position: "relative",
  alignItems: "center",
  flexDirection: "column",
});

const LabelText = styled.span(({ theme }) => ({
  minHeight: 28,
  color: theme.textColor.primary,
  transition: "color 200ms ease",
  fontSize: theme.typography.body1.size,
  fontWeight: theme.typography.body1.weight,
  lineHeight: theme.typography.body1.lineHeight,
}));

const ActiveIndicator = styled(motion.span)(({ theme }) => ({
  height: 1,
  width: "100%",
  display: "block",
  backgroundColor: theme.color.primary,
}));

const InactiveIndicator = styled.span({
  height: 1,
  width: "100%",
  display: "block",
  backgroundColor: "transparent",
});
