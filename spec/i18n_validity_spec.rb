require 'spec_helper'

describe "Theme" do
  FILE_KEYS = Dir["./**/*.liquid"].map do |path|
    match_tags(path)
  end.flatten.sort

  HTML_TRANSLATIONS = {}
  LOCALE_KEYS = {}

  Dir["./locales/*.json"].each do |path|
    translations = match_translations(path)
    locale = locale_name_from_path(path)

    HTML_TRANSLATIONS[locale] = html_translations(translations)
    LOCALE_KEYS[locale] = translations.keys
  end

  REFERENCE_KEYS = LOCALE_KEYS.delete('en.default')

  it "contains all the translated keys" do
    unused_keys = REFERENCE_KEYS - FILE_KEYS
    missing_keys = FILE_KEYS - REFERENCE_KEYS

    missing_keys_error_message = "Missing keys:\n #{missing_keys.uniq.join("\n\t")}" if missing_keys.any?
    unused_keys_error_message = "Unused keys:\n #{unused_keys.uniq.join("\n\t")}" if unused_keys.any?

    expect(missing_keys.size + unused_keys.size).to eq(0),
      [missing_keys_error_message, unused_keys_error_message].compact.join("\n\n")
  end

  it "have the same amount of keys in each locale file" do
    reference = REFERENCE_KEYS
    missing_keys = {}
    extra_keys = {}

    LOCALE_KEYS.each do |locale, translations|
      missing = (reference - translations)
      missing_keys[locale] = missing unless missing.empty?

      extra = (translations - reference)
      extra_keys[locale] = extra unless extra.empty?
    end

    report = StringIO.new
    report.puts "The following keys are present in 'en' but are missing in other locales" unless missing_keys.empty?
    output_keys_to_report(missing_keys, report)

    report.puts "The following keys are present in other locales but not in 'en'" unless extra_keys.empty?
    output_keys_to_report(extra_keys, report)

    expect(missing_keys.size + extra_keys.size).to eq(0), report.string
  end

  it "have valid html for html keys" do
    invalid_keys = {}

    HTML_TRANSLATIONS.each do |locale, translations|
      translations.each do |key, value|
        invalid_keys[locale] << key unless HTMLValidator.valid_html?(value)
      end
    end

    report = StringIO.new
    report.puts "The following keys have invalid html" unless invalid_keys.empty?
    output_keys_to_report(invalid_keys, report)

    expect(invalid_keys.size).to eq(0), report.string
  end
end

