class NbpService
  include HTTParty
  base_uri "https://api.nbp.pl/api/exchangerates"

  def self.current_rate(currency)
    response = get("/rates/a/#{currency}?format=json")

    return nil unless response.success?

    response["rates"][0]["mid"]
  end

  def self.history(currency, days)
    response = get("/rates/a/#{currency}/last/#{days}?format=json")
    return [] unless response.success?

    response["rates"].map { |r| { date: r["effectiveDate"], rate: r["mid"] } }
  end

  def self.all_rates
    response = get("/tables/a?format=json")
    return [] unless response.success?

    response[0]["rates"].map { |r| { code: r["code"], currency: r["currency"], rate: r["mid"] } }
  end
end
