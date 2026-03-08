import styled from "@emotion/styled";
import * as RadixSelect from "@radix-ui/react-select";
import arrowIconUrl from "@/assets/icons/icon-arrow.svg";

type SelectOption = {
  label: string;
  value: string;
};

type SelectBoxProps = {
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
};

export function SelectBox({ value, options, onValueChange }: SelectBoxProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <StyledTrigger>
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <ArrowIcon src={arrowIconUrl} alt="" />
        </RadixSelect.Icon>
      </StyledTrigger>
      <RadixSelect.Portal>
        <StyledContent>
          <StyledViewport>
            {options.map((option) => (
              <StyledItem key={option.value} value={option.value}>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </StyledItem>
            ))}
          </StyledViewport>
        </StyledContent>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

const StyledTrigger = styled(RadixSelect.Trigger)(({ theme }) => ({
  height: 48,
  width: "100%",
  outline: "none",
  display: "flex",
  padding: "0 16px",
  alignItems: "center",
  borderRadius: theme.radius.lg,
  color: theme.textColor.primary,
  justifyContent: "space-between",
  backgroundColor: theme.color.white,
  fontSize: theme.typography.body2.size,
  fontWeight: theme.typography.body2.weight,
  lineHeight: theme.typography.body2.lineHeight,
  border: `1px solid ${theme.color.borderSoft}`,
}));

const ArrowIcon = styled.img({
  width: 16,
  height: 8,
  opacity: 0.5,
  transform: "rotate(90deg)",
});

const StyledContent = styled(RadixSelect.Content)(({ theme }) => ({
  zIndex: 50,
  overflow: "hidden",
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.dropdown,
  backgroundColor: theme.color.white,
  border: `1px solid ${theme.color.borderSoft}`,
}));

const StyledViewport = styled(RadixSelect.Viewport)({
  padding: 8,
});

const StyledItem = styled(RadixSelect.Item)(({ theme }) => ({
  padding: "12px",
  outline: "none",
  borderRadius: theme.radius.md,
  color: theme.textColor.primary,
  fontSize: theme.typography.body2.size,
  fontWeight: theme.typography.body2.weight,
  transition: "background-color 200ms ease",
  lineHeight: theme.typography.body2.lineHeight,

  "&[data-highlighted]": {
    backgroundColor: theme.color.lightgray,
  },
}));
