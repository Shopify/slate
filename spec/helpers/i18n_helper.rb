EXCLUDED_KEYWORDS = ["date_formats"]

def match_tags(path)
  File.open(path).read.scan(/\{\{\s*(?:'|")([a-z0-9._]+?)(?:'|")(?:\s*\|\s*t)/).flatten.map do |key|
    next if include_excluded_keywords?(key)
    truncate_plural_key(key.split('.'))
  end.uniq
end

def match_translations(path)
  flatten_keys(JSON.parse(File.open(path).read)).each_with_object({}) do |(key, value), hash|
    next if include_excluded_keywords?(key)
    hash[truncate_plural_key(key)] = value
  end
end

def truncate_plural_key(key)
  key.delete_at(-1) if %w{zero one two other}.include?(key.last)
  key.join('.')
end

def include_excluded_keywords?(key)
  EXCLUDED_KEYWORDS.any? { |w| key.include?(w) }
end

def locale_name_from_path(path)
  path.scan(/locales\/(.*?).json/).flatten.first
end

def html_translations(translations)
  translations.select { |k, v| k.end_with?('_html') }
end

def flatten_keys(entry, keys = [], acc = {})
  if entry.is_a? Hash
    entry.each { |k, v| flatten_keys(v, keys + [k], acc) }
  else
    acc.merge!(keys => entry)
  end

  acc
end

def output_keys_to_report(keys, report)
  keys.each do |locale, keys|
    report.puts "#{locale}:\n\t #{keys.join("\n\t ")}"
  end
end
