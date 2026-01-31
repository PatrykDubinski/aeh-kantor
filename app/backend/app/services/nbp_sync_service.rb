class NbpSyncService
  def self.sync_current_rates
    rates = NbpService.all_rates
    today = Date.today

    rates.each do |r|
      ExchangeRate.find_or_initialize_by(currency: r[:code], date: today).update!(
        rate: r[:rate]
      )
    end
  end

  def self.sync_history(currency, days = 30)
    history = NbpService.history(currency, days)
    
    history.each do |h|
      ExchangeRate.find_or_initialize_by(currency: currency.upcase, date: h[:date]).update!(
        rate: h[:rate]
      )
    end
  end
end
