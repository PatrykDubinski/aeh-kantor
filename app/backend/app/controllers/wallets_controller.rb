class WalletsController < ApplicationController
  def index
    render json: current_user.wallets
  end
end
