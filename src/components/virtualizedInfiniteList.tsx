import { type ReactNode, type CSSProperties, useCallback, useMemo } from "react";
import { List, useDynamicRowHeight, type RowComponentProps } from "react-window";
import LoadingSpinner from "./common/LoadingSpinner";

// Internal row data shape (typed as unknown to allow generic T at the call site)
interface RowData {
  items: unknown[];
  renderItem: (item: unknown) => ReactNode;
  isFetchingMore: boolean;
}

// Defined outside component so it's a stable reference (no re-creation on render)
const RowComponent = ({
  index,
  style,
  items,
  renderItem,
  isFetchingMore,
}: RowComponentProps<RowData>) => {
  // Last slot: spinner row when fetching more
  if (index >= items.length) {
    return (
      <div style={style} className="flex items-center justify-center py-4">
        {isFetchingMore && <LoadingSpinner />}
      </div>
    );
  }

  const item = items[index];
  if (item == null) return null;

  return <div style={style}>{renderItem(item)}</div>;
};

// Load more when this many items from the end are visible
const LOAD_THRESHOLD = 5;

interface VirtualizedInfiniteListProps<T extends object> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isFetchingMore: boolean;
  /** Default row height estimate in px. Actual heights are measured via ResizeObserver. */
  estimateSize?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Generic virtualized list with infinite scroll support.
 *
 * Usage: place inside a `flex flex-col h-screen` (or fixed-height) parent and
 * pass `className="flex-1 min-h-0"` so it fills the remaining space.
 *
 * react-window v2 automatically measures actual row heights via ResizeObserver
 * when `useDynamicRowHeight` is used — no manual ref work needed in renderItem.
 */
const VirtualizedInfiniteList = <T extends object>({
  items,
  renderItem,
  onLoadMore,
  hasMore,
  isFetchingMore,
  estimateSize = 150,
  className,
  style,
}: VirtualizedInfiniteListProps<T>) => {
  const dynamicHeight = useDynamicRowHeight({ defaultRowHeight: estimateSize });

  // Extra slot for the spinner row
  const rowCount = items.length + (hasMore || isFetchingMore ? 1 : 0);

  const handleRowsRendered = useCallback(
    (visible: { startIndex: number; stopIndex: number }) => {
      if (
        visible.stopIndex >= items.length - LOAD_THRESHOLD &&
        hasMore &&
        !isFetchingMore
      ) {
        onLoadMore();
      }
    },
    [items.length, hasMore, isFetchingMore, onLoadMore],
  );

  // Cast to unknown[] so RowComponent can be defined outside the generic component
  const rowProps: RowData = useMemo(
    () => ({
      items: items as unknown[],
      renderItem: renderItem as (item: unknown) => ReactNode,
      isFetchingMore,
    }),
    [items, renderItem, isFetchingMore],
  );

  return (
    <List
      className={className}
      style={style}
      rowComponent={RowComponent}
      rowCount={rowCount}
      rowHeight={dynamicHeight}
      rowProps={rowProps}
      onRowsRendered={handleRowsRendered}
      overscanCount={3}
    />
  );
};

export default VirtualizedInfiniteList;
