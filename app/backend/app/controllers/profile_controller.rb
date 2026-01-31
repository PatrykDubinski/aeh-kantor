class ProfileController < ApplicationController
  def show
    render json: {
      email: current_user.email,
      balance: current_user.balance
    }
  end

  def top_up
    amount = params[:amount].to_f
    if amount <= 0
      return render json: { error: "Amount must be positive" }, status: :unprocessable_entity
    end

    current_user.balance ||= 0
    current_user.balance += amount
    current_user.save!

    render json: { balance: current_user.balance, message: "Account topped up successfully" }
  end
end
