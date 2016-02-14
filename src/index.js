import { cloneElement } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

let counter = 0;
const map = new WeakMap();
const idPrefix = 'react-inline-styles-';

const isPseudo = (obj, key) => /^:|@/.test(key) && typeof obj[key] === 'object';

const forEach = (children, fn) => {
  return Array.isArray(children) ? children.forEach(fn) : fn(children, 0);
}

const traverse = (element, styleSheet) => {
  clearSheet(styleSheet);
  debugger;
  innerTraverse(element, '.0.0');

  function innerTraverse(element, path = '.x', parent, index) {

    // if (Array.isArray(element)) {
    //   forEach(element, (child, index) => innerTraverse(child, `${path}.${index}`, parent, index));
    // }

    if (element && element.props) {

      const { children, style } = element.props;

      if (children) {
        forEach(children, (child, index) => innerTraverse(child, `${path}.${index}`, element, index));
      }

      if (style) {
        const styles = style;
        const keys = Object.keys(style);
        keys
          .filter(key => isPseudo(styles, key))
          .forEach(key => {
            const selector = idPrefix + path.replace(/\./g, '-');
            const className = (element.props.className ? element.props.className + ' ' : '') + selector;
            const replacement = cloneElement(element, { className });
            if (Array.isArray(parent.props.children)) {
              parent.props.children.splice(index, 1, replacement);
            } else {
              parent.props.children = replacement;
            }
            addPseudoRule(styleSheet, selector, key, styles[key]);
          });
        ;
      }

    }
  }

};

const clearSheet = styleSheet => {
  while (styleSheet.sheet.rules.length) styleSheet.sheet.removeRule();
};
const addPseudoRule = (styleSheet, className, pseudo, ruleObject) => {
  const prefix = `.${className}${pseudo} { `;
  const rule = Object.keys(ruleObject).reduce((rule, key) => rule + `${key}: ${ruleObject[key]} !important; `, '');
  const postFix = '}\n';
  const fullRule = `${prefix}${rule}${postFix}`;
  styleSheet.sheet.insertRule(fullRule, 0);
};


export default Component => {
  console.log('calling defa');
  const id = counter++;
  const styleSheet = document.createElement('style');
  document.head.appendChild(styleSheet);
  const WrappedComponent = class extends Component {
    render() {
      const freeze = Object.freeze;
      Object.freeze = function() {};
      const renderResult = super.render();
      Object.freeze = freeze;
      traverse(renderResult, styleSheet);
      return renderResult;
    }
  }

  return hoistNonReactStatics(WrappedComponent, Component);
}
