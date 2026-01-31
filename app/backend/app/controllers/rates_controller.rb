class RatesController < ApplicationController
  def index
    last_sync = ExchangeRate.order(updated_at: :desc).first&.updated_at
    
    if last_sync && last_sync > 10.minutes.ago
      rates = ExchangeRate.where(date: Date.today).map do |r|
        { code: r.currency, rate: r.rate.to_f, currency: r.currency }
      end
      return render json: { rates: rates } if rates.any?
    end

    begin
      rates = NbpService.all_rates
      render json: { rates: rates }
    rescue => e
      render json: { error: "Failed to fetch rates: #{e.message}" }, status: :service_unavailable
    end
  end

  def history
    currency = params[:currency]&.upcase || "USD"
    days = (params[:days] || 7).to_i
    
    rates = ExchangeRate.where(currency: currency)
                        .where("date >= ?", days.days.ago.to_date)
                        .order(date: :asc)
    
    render json: rates.map { |r| { date: r.date, rate: r.rate.to_f } }
  end

  def current
    rate = NbpService.current_rate(params[:currency].upcase)
    render json: { currency: params[:currency].upcase, rate: rate }
  end

  def history
    history = NbpService.history(params[:currency].upcase, params[:days].to_i)
    render json: history
  end
end
