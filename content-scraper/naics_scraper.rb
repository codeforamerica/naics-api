require 'pry'
require 'httparty'
require 'nokogiri'
require 'mongo'

module NaicsScraper

  include Mongo

  def self.put_year_content_in_mongo(year)
    initialize_mongo_for_year(year)
    all_codes_for_year = get_codes_for_year(year)
    all_codes_for_year["items"].each do |item|
      # I believe descriptions are only for 5- and 6-character codes
      # Also check that we haven't already saved to Mongo for that code
      if item["code"].to_s.length > 4 && @@coll.find("code"=>item["code"]).to_a.count == 0
        puts "Working on #{item['code']}..."
        code_data = { code: item["code"] }
        begin
          code_data[:content] = get_content_for_code(item["code"])
        # In case our scraper's indexing is FUBAR for a code
        rescue NoMethodError
          code_data[:content] = nil
          # Drop into Pry so we can see what the heck happened
          binding.pry
        end
        @@coll.insert(code_data)
      end
    end
  end

  def self.initialize_mongo_for_year(year)
    @@mongo_client = MongoClient.new("localhost", 27017)
    @@db = @@mongo_client.db("naics")
    @@coll = @@db["naics-data-#{year}"]
  end

  def self.get_codes_for_year(year)
    # May want to add error handling for year constraints (eg, only allow args of 2012/2007/2002)
    response = HTTParty.get("http://naics-api.herokuapp.com/v0/q?year=#{year}")
  end

  def self.get_content_for_code(code)
    response = HTTParty.get("http://www.census.gov/cgi-bin/sssd/naics/naicsrch?code=#{code}&search=2012%20NAICS%20Search")
    parsed_doc = Nokogiri::HTML(response.body)
    pieces = parsed_doc.css("#middle-column .inside")
    if code.to_s.length == 6
      content = pieces[0].children[10].children[2].text
    elsif code.to_s.length == 5
      binding.pry
      content = pieces[0].children[10].children[4].text
    else
      binding.pry
    end
    content.strip
  end

  def self.play_with_year_in_mongo(year)
    initialize_mongo_for_year(year)
    # GO TO TOWN
    # Example play:
    # 1. Check out all the 5-digit codes
    #@@coll.find.each { |row| p "#{row['code']} - #{row['content']}" if row["code"].to_s.length == 5 }
    binding.pry
  end

end

# Example usage
#code_description = NaicsScraper.get_content_for_code(111120)
#all_2012_codes = NaicsScraper.put_year_content_in_mongo(2012)

binding.pry
