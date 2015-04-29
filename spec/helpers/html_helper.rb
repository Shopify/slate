module HTMLValidator
  HTML5_TAGS = [
    "a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo",
    "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup",
    "data", "datalist", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "embed", "fieldset",
    "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header",
    "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li",
    "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript",
    "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt",
    "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style",
    "sub", "summary", "svg", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time",
    "title", "tr", "track", "u", "ul", "var", "video", "wbr",
  ]

  def self.valid_html?(string)
    document = Nokogiri::HTML::DocumentFragment.parse(string)
    document.errors << Nokogiri::SyntaxError.new("Missing enclosing tag") if HTMLEntities.new.decode(document.to_xhtml) != HTMLEntities.new.decode(string)

    errors = document.errors.reject { |e| reject_error?(e) }

    errors.empty?
  end

  private

  def whitelisted_tag?(e)
    return unless match = e.message.match(/Tag (\w+) invalid/)
    HTML5_TAGS.include?(match[1])
  end

  def reject_error?(e)
    return true if e.message =~ /^htmlParseEntityRef:/
    return true if e.message =~ /ID .* already defined/
    return true if whitelisted_tag?(e)
  end
end
