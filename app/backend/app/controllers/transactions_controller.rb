class TransactionsController < ApplicationController
  def index
    transactions = current_user.transactions
    
    transactions = transactions.where(currency: params[:currency].upcase) if params[:currency].present?
    transactions = transactions.where(direction: params[:direction]) if params[:direction].present?
    
    if params[:start_date].present? && params[:end_date].present?
      transactions = transactions.where(created_at: params[:start_date]..params[:end_date].to_date.end_of_day)
    end

    render json: transactions.order(created_at: :desc)
  end

  def create
    currency = params[:currency].upcase
    amount = params[:amount].to_f
    direction = params[:direction]

    rate = NbpService.current_rate(currency)
    return render json: { error: "Rate not found" }, status: 404 if rate.nil?

    ActiveRecord::Base.transaction do
      wallet = current_user.wallets.find_or_create_by(currency: currency)
      wallet.amount ||= 0

      if direction == "buy"
        cost = amount * rate

        if current_user.balance < cost
          return render json: { error: "Insufficient funds" }, status: 400
        end

        current_user.balance -= cost
        wallet.amount += amount
      elsif direction == "sell"
        if wallet.amount < amount
          return render json: { error: "Not enough currency" }, status: 400
        end

        wallet.amount -= amount
        current_user.balance += amount * rate
      else
        return render json: { error: "Invalid direction" }, status: 400
      end

      current_user.save!
      wallet.save!

      trx = current_user.transactions.create!(
        currency: currency,
        rate: rate,
        amount: amount,
        direction: direction
      )

      render json: trx, status: :created
    end
  end
end
