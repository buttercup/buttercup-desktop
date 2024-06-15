export function selectElementContents(el: HTMLElement): void {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
