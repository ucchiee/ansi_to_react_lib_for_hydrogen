"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const anser_1 = __importDefault(require("anser"));
const escape_carriage_1 = require("escape-carriage");
const React = __importStar(require("react"));
const LINK_REGEX = /^(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})$/;
/**
 * Converts ANSI strings into JSON output.
 * @name ansiToJSON
 * @function
 * @param {String} input The input string.
 * @param {boolean} use_classes If `true`, HTML classes will be appended
 *                              to the HTML output.
 * @return {Array} The parsed input.
 */
function ansiToJSON(input, use_classes = false) {
    input = escape_carriage_1.escapeCarriageReturn(input);
    return anser_1.default.ansiToJson(input, {
        json: true,
        remove_empty: true,
        use_classes
    });
}
/**
 * Create a class string.
 * @name createClass
 * @function
 * @param {AnserJsonEntry} bundle
 * @return {String} class name(s)
 */
function createClass(bundle) {
    let classNames = "";
    if (bundle.bg) {
        classNames += `${bundle.bg}-bg `;
    }
    if (bundle.fg) {
        classNames += `${bundle.fg}-fg `;
    }
    if (bundle.decoration) {
        classNames += `ansi-${bundle.decoration} `;
    }
    if (classNames === "") {
        return null;
    }
    classNames = classNames.substring(0, classNames.length - 1);
    return classNames;
}
/**
 * Create the style attribute.
 * @name createStyle
 * @function
 * @param {AnserJsonEntry} bundle
 * @return {Object} returns the style object
 */
function createStyle(bundle) {
    const style = {};
    if (bundle.bg) {
        style.backgroundColor = `rgb(${bundle.bg})`;
    }
    if (bundle.fg) {
        style.color = `rgb(${bundle.fg})`;
    }
    return style;
}
/**
 * Converts an Anser bundle into a React Node.
 * @param linkify whether links should be converting into clickable anchor tags.
 * @param useClasses should render the span with a class instead of style.
 * @param bundle Anser output.
 * @param key
 */
function convertBundleIntoReact(linkify, useClasses, bundle, key) {
    const style = useClasses ? null : createStyle(bundle);
    const className = useClasses ? createClass(bundle) : null;
    if (!linkify) {
        return React.createElement("span", { style, key, className }, bundle.content);
    }
    const content = bundle.content
        .split(/(\s+)/)
        .reduce((words, word, index) => {
        // If this is a separator, re-add the space removed from split.
        if (index % 2 === 1) {
            words.push(word);
            return words;
        }
        // If  this isn't a link, just return the word as-is.
        if (!LINK_REGEX.test(word)) {
            words.push(word);
            return words;
        }
        // Make sure the href we generate from the link is fully qualified. We assume http
        // if it starts with a www because many sites don't support https
        const href = word.startsWith("www.") ? `http://${word}` : word;
        words.push(React.createElement("a", {
            key: index,
            href,
            target: "_blank"
        }, `${word}`));
        return words;
    }, []);
    return React.createElement("span", { style, key, className }, content);
}
function Ansi(props) {
    const { className, useClasses, children, linkify } = props;
    return React.createElement("code", { className }, ansiToJSON(children !== null && children !== void 0 ? children : "", useClasses !== null && useClasses !== void 0 ? useClasses : false).map(convertBundleIntoReact.bind(null, linkify !== null && linkify !== void 0 ? linkify : false, useClasses !== null && useClasses !== void 0 ? useClasses : false)));
}
exports.default = Ansi;
