import styled from "@emotion/styled";
import favoriteEmptyIconUrl from "@/assets/icons/icon-favorite-empty.svg";
import favoriteFillIconUrl from "@/assets/icons/icon-favorite-fill.svg";

type FavoriteButtonProps = {
  usedTo?: "list" | "detail";
  pressed: boolean;
  onClick?: () => void;
};

export function FavoriteButton({
  pressed,
  usedTo = "detail",
  onClick,
}: FavoriteButtonProps) {
  return (
    <ButtonRoot
      type="button"
      $usedTo={usedTo}
      aria-pressed={pressed}
      aria-label={pressed ? "remove-favorite" : "add-favorite"}
      onClick={onClick}
    >
      <HeartIcon
        src={pressed ? favoriteFillIconUrl : favoriteEmptyIconUrl}
        alt=""
        aria-hidden
      />
    </ButtonRoot>
  );
}

const ButtonRoot = styled.button<{ $usedTo: "list" | "detail" }>(
  ({ $usedTo, theme }) => ({
    border: 0,
    padding: 0,
    lineHeight: 0,
    cursor: "pointer",
    position: "absolute",
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center",
    boxShadow: theme.shadow.card,
    backgroundColor: "transparent",
    top: $usedTo === "list" ? 0 : 8,
    right: $usedTo === "list" ? 0 : 8,
    width: $usedTo === "list" ? 16 : 24,
    height: $usedTo === "list" ? 16 : 24,
  }),
);

const HeartIcon = styled.img({
  width: "100%",
  height: "100%",
  display: "block",
});
