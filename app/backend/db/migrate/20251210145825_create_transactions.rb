class CreateTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :transactions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :currency
      t.decimal :rate
      t.decimal :amount
      t.string :direction

      t.timestamps
    end
  end
end
