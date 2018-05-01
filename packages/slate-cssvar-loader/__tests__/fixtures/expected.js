exports = module.exports = require("../../node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.id, ".heading {\n  color: {{ settings.headings_color }};\n  background-color: '#FF00FF';\n  letter-spacing: {{ settings.letter_spacing }}px;\n}\n\n.title {\n  color: {{ settings.headings_color }};\n  font-weight: {{ font_body_bold.weight | default: \"bold\" }};\n}\n\nbody {\n  background-color: {{ settings.body_color }};\n}", ""]);

// exports
