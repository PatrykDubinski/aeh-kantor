class AddBaseCurrencyToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :base_currency, :string, default: 'PLN'
  end
end
