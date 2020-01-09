export function positionToGridAreaNotation (position) {
    const [from, to = null] = position.toLowerCase().split(':');

    if (from.length !== 2 || (to && to.length !== 2)) {
        return ;
    }

    const areaFrom = `${from[1]} / ${indexInAlphabet(from[0])}`;
    const area = to ? `${areaFrom} / ${Number(to[1]) + 1} / ${indexInAlphabet(to[0]) + 1}` : areaFrom;

    return area ;
}

function indexInAlphabet(character) {
    const index = character.toLowerCase().charCodeAt(0) - 96;
    return index < 1 ? 1 : index;
}
