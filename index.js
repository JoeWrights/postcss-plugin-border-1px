module.exports = ({ ignoreCommentText = 'no' } = {}) => {
  const afterPseudoExp = /(.*::?)(after)$/;
  const beforePseudoExp = /(.*::?)(before)$/;
  const BORDER_ATTRS = ["border", "border-left", "border-right", "border-top", "border-bottom", "border-width"];
  let hasRelative = false;
  let borderRadius = {}

  /**
   * generate border style
   * @param {*} selector selector
   * @param {*} decl Declaration
   * @returns {string} style block for different dpr
   */
  const geneBorderCommonStyle = (selector, decl = {}, radius = {}) => {
    const genStyle = (radio = 1) => radius.value
      ? `@media (-webkit-min-device-pixel-ratio: ${radio}), (min-device-pixel-ratio: ${radio}) {
        ${selector} {
          ${decl.prop}: ${decl.value};
          -webkit-border-radius: ${radius.unit === '%' ? `${radius.value}${radius.unit}` : `${radius.value * radio}${radius.unit}`};
          border-radius: ${radius.unit === '%' ? `${radius.value}${radius.unit}` : `${radius.value * radio}${radius.unit}`};
          position: absolute;
          content: '';
          top: 0;
          left: 0;
          -webkit-transform-origin: top left;
          transform-origin: top left;
          width: ${radio * 100}%;
          height: ${radio * 100}%;
          -webkit-transform: scale(${1 / radio});
          transform: scale(${1 / radio});
          pointer-events: none;
        }
      }`
      : `@media (-webkit-min-device-pixel-ratio: ${radio}), (min-device-pixel-ratio: ${radio}) {
        ${selector} {
          ${decl.prop}: ${decl.value};
          position: absolute;
          content: '';
          top: 0;
          left: 0;
          -webkit-transform-origin: top left;
          transform-origin: top left;
          width: ${radio * 100}%;
          height: ${radio * 100}%;
          -webkit-transform: scale(${1 / radio});
          transform: scale(${1 / radio});
          pointer-events: none;
        }
      }`;
    const styles = [2, 3].reduce((acc, cur) => {
      return `
      ${acc}
      ${genStyle(cur)}
    `;
    }, genStyle());
    return styles;
  };

  return {
    postcssPlugin: 'postcss-border1px',

    Once(root) {
      root.walkRules((rule) => {
        hasRelative = false;
        rule.walkDecls((decl) => {
          const borderValues = decl.value.split(" ");

          if (BORDER_ATTRS.indexOf(decl.prop) === -1) return;
          if (borderValues[0] !== "1px") return;

          // if find before pseudo
          if (decl.parent && beforePseudoExp.test(decl.parent.selector)) return;

          // find border-radius decl
          decl.parent && decl.parent.walkDecls("border-radius", (borderRadiusDecl) => {
            const isPxUnit = borderRadiusDecl.value.toLowerCase().indexOf("px") !== -1;
            const isPercentUnit = borderRadiusDecl.value.indexOf("%") !== -1;
            if (isPxUnit || isPercentUnit) {
              borderRadius.value = borderRadiusDecl.value.substr(0, isPercentUnit ? borderRadiusDecl.value.length - 1 : borderRadiusDecl.value.length - 2);
              borderRadius.selector = `${borderRadiusDecl.parent.selector}:after`;
              borderRadius.unit = isPxUnit ? "px" : "%";
            }
            // get border-radius & remove it 
            rule.removeChild(borderRadiusDecl);
          });

          const curDeclIdx = rule.nodes.findIndex(({ prop }) => prop === decl.prop);
          const nextNode = rule.nodes[curDeclIdx + 1];
          const curDeclComment = (nextNode || {}).type === "comment" ? nextNode : null;

          if (curDeclComment) {
            // TODO: other comment
            if (curDeclComment.text === ignoreCommentText) {
              return;
            }
          } else {
            rule.selectors = rule.selectors.reduce((acc, cur) => {
              return !afterPseudoExp.test(cur) ? acc.concat(`${cur}:after`) : acc;
            }, rule.selectors);

            const afterPseudoSelector = rule.selectors.filter((selector) => afterPseudoExp.test(selector));

            afterPseudoSelector.forEach((selector) => {
              if (borderRadius.selector === selector) {
                borderRadius.value && root.prepend(geneBorderCommonStyle(selector, decl, borderRadius));
              } else {
                root.prepend(geneBorderCommonStyle(selector, decl));
              }
            });

            rule.selectors = rule.selectors.slice(0, 1);
            rule.removeChild(decl);

            !hasRelative &&
              rule.append({
                prop: "position",
                value: "relative"
              });
            hasRelative = true;
          }
        });
      });
    }
  }
}

module.exports.postcss = true
