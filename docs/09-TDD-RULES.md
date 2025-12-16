# CANON TDD – KENT BECK 2025 ONAYLI CHEAT SHEET  
**(Duvara asmalık – Hem Türkçe hem İngilizce)**

## 5 ALTIN KURAL (Değiştirilemez – Tam Kent Beck onaylı)

| # | TÜRKÇE                                                   | ENGLISH                                                            |
|---|----------------------------------------------------------|--------------------------------------------------------------------|
| 1 | Davranışa odaklan, implementasyona değil                 | Focus on behavior, not implementation                              |
| 2 | Tek bir assertion’lı test yaz ve geçir → tasarımın organik evrilmesini sağla | Write & pass one asserted test at a time → let design emerge organically |
| 3 | Testi geçirirken sadece çalıştır, temizleme/refactor yapma | Make it run only — no refactoring yet                              |
| 4 | Refactor yaparken sadece bu döngünün bağlamında kal, global cleanup yapma | Refactor only what’s needed for the current cycle — no global cleanup |
| 5 | Korku tamamen sıkılmaya dönüşene kadar döngüyü sürdür    | Continue until fear turns into boredom                             |

## “Ekstra” sandığımız noktalar aslında bu 5 kuralın içinde erimiş durumda

### Türkçe Versiyon

| Kent Beck’in vurguladığı nokta (çoğu kişi “ekstra” sanıyor)                          | Asıl ait olduğu altın kural | Bu 5 altın kural içinde zaten nasıl yer alıyor?                                                                                  |
| :----------------------------------------------------------------------------------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| Arayüz kararlarını test yazarken, implementasyon kararlarını sadece refactor’da al | 1 + 3                       | 1 → Davranışa odaklan, implementasyona değil<br>3 → Testi geçirirken sadece çalıştır, temizleme/refactor yapma                |
| Test sırasını bilinçli / stratejik seçmek                                           | 2                           | 2 → Tek bir assertion’lı test yaz ve geçir → tasarımın organik evrilmesini sağla                                                |
| Yeni test fikri gelirse hemen Test Listesine ekle                                   | 1 + 5                       | 1 → Davranışa odaklan, implementasyona değil<br>5 → Korku tamamen sıkılmaya dönüşene kadar döngüyü sürdür                       |
| Bir test geçerken önceki kararları çökertirse cesurca geri al ve yeniden başla      | 2 + 5                       | 2 → Tek bir assertion’lı test yaz ve geçir → tasarımın organik evrilmesini sağla<br>5 → Korku tamamen sıkılmaya dönüşene kadar döngüyü sürdür |
| Duplikasyon bir ipucudur, emir değildir (Rule of Three – 3. tekrarda temizle)       | 4                           | 4 → Refactor yaparken sadece bu döngünün bağlamında kal, global cleanup yapma                                                  |

### English Version

| Point Kent Beck emphasized (most people think it’s “extra”)                          | Belongs to golden rule(s) | How it’s already covered by our exact 5 golden rules                                                                                     |
| :----------------------------------------------------------------------------------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| Interface decisions while writing tests, implementation decisions only in refactor | 1 + 3                     | 1 → Focus on behavior, not implementation<br>3 → Make it run only — no refactoring yet                                                      |
| Deliberately choose the next test (most revealing/simplest first)                   | 2                         | 2 → Write & pass one asserted test at a time → let design emerge organically                                                                    |
| When a new test idea comes, immediately add it to the Test List                     | 1 + 5                     | 1 → Focus on behavior, not implementation<br>5 → Continue until fear turns into boredom                                                       |
| If a passing test invalidates previous decisions → courageously throw away & restart | 2 + 5                   | 2 → Write & pass one asserted test at a time → let design emerge organically<br>5 → Continue until fear turns into boredom                    |
| Duplication is a hint, not a command (Rule of Three)                                | 4                         | 4 → Refactor only what’s needed for the current cycle — no global cleanup                                                                      |

Bu markdown dosyasını kopyala → GitHub, Notion, Obsidian ya da herhangi bir yerde aç → PDF olarak dışa aktar → yazdır → laminat yaptır → masana/monitoruna as.

Artık hem senin hem takımın için mükemmel bir Canon TDD referansı hazır!