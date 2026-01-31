namespace :nbp do
  desc "Sync current exchange rates from NBP"
  task sync: :environment do
    puts "Syncing current rates..."
    NbpSyncService.sync_current_rates
    puts "Done!"
  end

  desc "Sync historical rates (30 days)"
  task :sync_history, [:currency, :days] => :environment do |t, args|
    currency = args[:currency] || "USD"
    days = (args[:days] || 30).to_i
    puts "Syncing history for #{currency} (#{days} days)..."
    NbpSyncService.sync_history(currency, days)
    puts "Done!"
  end
end
