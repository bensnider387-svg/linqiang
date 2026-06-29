export interface ParsedStockPick {
  symbol: string;
  price: string;
  buyTime?: string;
  position?: string;
}

export interface ParsedTradingFocus {
  notices: string[];
  purchaseDate: string | null;
  stocks: ParsedStockPick[];
  others: string[];
}

export interface TradingFocusItem {
  symbol: string;
  buy_time: string;
  buy_price: string;
  position: string;
}

export const POSITION_OPTIONS = [
  '5%',
  '10%',
  '15%',
  '20%',
  '25%',
  '30%',
  '40%',
  '50%',
  '60%',
  '70%',
  '80%',
  '90%',
  '100%',
];

export function normalizePosition(value: string): string {
  const text = String(value || '').trim();
  if (!text) return '';

  if (text.endsWith('%')) {
    return text;
  }

  const num = Number(text);
  if (!Number.isNaN(num) && num > 0 && num <= 100) {
    return `${num}%`;
  }

  return POSITION_OPTIONS.includes(text) ? text : text;
}

export function formatPositionDisplay(value?: string): string {
  const normalized = normalizePosition(value || '');
  if (!normalized) return '';
  return normalized.endsWith('%') ? normalized : `${normalized}%`;
}

export function formatPositionHint(value?: string): string {
  const display = formatPositionDisplay(value);
  if (!display) return '';
  return `${display} of portfolio`;
}

/** 后台列表预览用 */
export const SHARE_FOCUS_PREVIEW_LABELS = {
  symbol: '股票',
  buyTime: '建议时间',
  buyPrice: '建议价',
  position: '建议仓位',
} as const;

export function formatTradingFocusPreview(raw: unknown): string {
  return parseTradingFocusItems(raw)
    .map((item) => {
      const parts = [
        item.symbol ? `${SHARE_FOCUS_PREVIEW_LABELS.symbol} ${item.symbol}` : '',
        item.buy_time ? `${SHARE_FOCUS_PREVIEW_LABELS.buyTime} ${formatBuyTime(item.buy_time)}` : '',
        item.buy_price ? `${SHARE_FOCUS_PREVIEW_LABELS.buyPrice} ${item.buy_price}` : '',
        item.position ? `${SHARE_FOCUS_PREVIEW_LABELS.position} ${formatPositionDisplay(item.position)}` : '',
      ];
      return parts.filter(Boolean).join(' | ');
    })
    .filter(Boolean)
    .join('；');
}

import { formatUSDate } from './dateFormat';

export function formatBuyTime(value: unknown): string {
  if (!value) return '';

  if (typeof value === 'string') {
    return formatUSDate(value.trim());
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatUSDate(value);
  }

  return formatUSDate(String(value).trim());
}

type NormalizedTradingFocusItem = string | Record<string, unknown>;

function isStructuredFocusItem(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item);
}

export function createEmptyTradingFocusItem(): TradingFocusItem {
  return {
    symbol: '',
    buy_time: '',
    buy_price: '',
    position: '',
  };
}

export function parseTradingFocusItems(raw: unknown): TradingFocusItem[] {
  let items = raw;

  if (typeof raw === 'string') {
    const text = raw.trim();
    if (!text) return [createEmptyTradingFocusItem()];

    try {
      items = JSON.parse(text);
    } catch {
      return [{ ...createEmptyTradingFocusItem(), symbol: text }];
    }
  }

  if (!Array.isArray(items) || items.length === 0) {
    return [createEmptyTradingFocusItem()];
  }

  return items.map((item) => {
    if (typeof item === 'string') {
      return { ...createEmptyTradingFocusItem(), symbol: item.trim() };
    }

    if (isStructuredFocusItem(item)) {
      return {
        symbol: String(item.symbol || item.stock_code || '').trim(),
        buy_time: String(item.buy_time || item.buyTime || '').trim(),
        buy_price: String(item.buy_price || item.buyPrice || item.price || '').trim(),
        position: normalizePosition(String(item.position || item.size || '')),
      };
    }

    return createEmptyTradingFocusItem();
  });
}

export function normalizeTradingFocus(raw: unknown): NormalizedTradingFocusItem[] {
  if (Array.isArray(raw)) {
    return raw.filter((item) => {
      if (typeof item === 'string') {
        return item.trim().length > 0;
      }
      return isStructuredFocusItem(item);
    });
  }

  if (typeof raw === 'string') {
    const text = raw.trim();
    if (!text) return [];

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return normalizeTradingFocus(parsed);
      }
    } catch {
      return [text];
    }
  }

  return [];
}

export function parseTradingFocus(items: NormalizedTradingFocusItem[]): ParsedTradingFocus {
  const result: ParsedTradingFocus = {
    notices: [],
    purchaseDate: null,
    stocks: [],
    others: [],
  };

  let pendingSymbol: string | null = null;

  for (const item of items) {
    if (isStructuredFocusItem(item)) {
      const symbol = String(item.symbol || item.stock_code || '').trim();
      const price = String(item.buy_price || item.buyPrice || item.price || '').trim();
      const buyTime = String(item.buy_time || item.buyTime || '').trim();
      const position = normalizePosition(String(item.position || item.size || ''));

      if (symbol || price || buyTime || position) {
        result.stocks.push({
          symbol: symbol || '-',
          price: price || '-',
          buyTime: buyTime || undefined,
          position: position || undefined,
        });

        if (buyTime && !result.purchaseDate) {
          result.purchaseDate = buyTime;
        }
      }
      continue;
    }

    const value = String(item ?? '').trim();
    if (!value) continue;

    if (/购买须知|purchase notice/i.test(value)) {
      const notice = value
        .replace(/^[\s✅⏰🔔]+/u, '')
        .replace(/购买须知[：:]?\s*/i, '')
        .replace(/purchase notice[：:]?\s*/i, '')
        .trim();
      result.notices.push(notice || value);
      continue;
    }

    const dateMatch =
      value.match(/(?:购买日期|purchase date)[：:]\s*(.+)$/i) ||
      value.match(/^⏰\s*(.+)$/u);
    if (dateMatch) {
      result.purchaseDate = dateMatch[1].replace(/^(?:购买日期|purchase date)[：:]\s*/i, '').trim();
      continue;
    }

    const symbolMatch =
      value.match(/(?:股票昵称|stock nickname|symbol|ticker)[：:]\s*(.+)$/i) ||
      value.match(/^✅\s*([A-Z0-9.]{1,10})$/i);
    if (symbolMatch) {
      pendingSymbol = symbolMatch[1].trim();
      continue;
    }

    const priceMatch = value.match(/(?:购买价格|purchase price|entry price|price)[：:]\s*(.+)$/i);
    if (priceMatch) {
      if (pendingSymbol) {
        result.stocks.push({
          symbol: pendingSymbol,
          price: priceMatch[1].trim(),
        });
        pendingSymbol = null;
      } else {
        result.others.push(value);
      }
      continue;
    }

    if (pendingSymbol) {
      result.stocks.push({
        symbol: pendingSymbol,
        price: value.replace(/^[\s✅⏰🔔]+/u, '').trim(),
      });
      pendingSymbol = null;
      continue;
    }

    result.others.push(value);
  }

  if (pendingSymbol) {
    result.stocks.push({ symbol: pendingSymbol, price: '-' });
  }

  return result;
}
