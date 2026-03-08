import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "./Button";
import { Fallback } from "./Fallback";

type QueryErrorBoundaryProps = {
  children: ReactNode;
  resetKey: string;
  title: string;
};

export function QueryErrorBoundary({
  children,
  resetKey,
  title,
}: QueryErrorBoundaryProps) {
  return (
    <ErrorBoundary
      resetKeys={[resetKey]}
      fallbackRender={({ resetErrorBoundary }) => (
        <Fallback
          title={title}
          description="요청이 일시적으로 실패했습니다. 검색 조건을 바꾸거나 다시 시도해 주세요."
          action={
            <Button variant="gray" onClick={resetErrorBoundary}>
              다시 시도
            </Button>
          }
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
