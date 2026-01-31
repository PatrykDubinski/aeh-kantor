class AddDefaultToWalletAmount < ActiveRecord::Migration[7.1]
  def up
    change_column_default :wallets, :amount, from: nil, to: 0
    Wallet.where(amount: nil).update_all(amount: 0)
    change_column_null :wallets, :amount, false, 0
  end

  def down
    change_column_default :wallets, :amount, from: 0, to: nil
    change_column_null :wallets, :amount, true
  end
end
