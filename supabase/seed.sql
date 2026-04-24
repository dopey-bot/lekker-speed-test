-- Seed slogans for Lekker Speed Test.
-- Buckets (Mbps): 0-5 (painful), 5-25 (okay), 25-100 (lekker), 100-500 (fast), 500+ (Ferrari)
-- Languages: en, af, zu, xh, st, ts, tn, nr, ss, ve, nso
-- Tone: warm and funny, never mean. Review all copy with native speakers before going live.

insert into public.slogans (text, language, topic, speed_bucket_min_mbps, speed_bucket_max_mbps) values
-- 0–5 Mbps: painful
('Your internet is slower than a Home Affairs queue on a Monday.', 'en', 'home_affairs', 0, 5),
('Eish, this speed is loadshedding in disguise.', 'en', 'load_shedding', 0, 5),
('Jy moet jou ISP bel — hierdie is nie lekker nie.', 'af', 'isp', 0, 5),
('Sipho, slower than a bakkie stuck in a pothole.', 'en', 'potholes', 0, 5),
('Your speed is doing admin at the licensing department.', 'en', 'licensing', 0, 5),
('Hierdie spoed is stadiger as ''n skilpad op pad Kaap toe.', 'af', 'general', 0, 5),
('Lento njengeminwe yemali ka-Eskom.', 'zu', 'eskom', 0, 5),
('Dololo internet — phone Telkom, Thandi.', 'en', 'telkom', 0, 5),

-- 5–25 Mbps: okay
('Good enough for WhatsApp voice notes — not much else.', 'en', 'general', 5, 25),
('Hierdie is ''n tannie-met-roomys tempo.', 'af', 'general', 5, 25),
('You can stream one braai recipe in HD. One.', 'en', 'braai', 5, 25),
('Speed = one Telkom technician on a Thursday.', 'en', 'telkom', 5, 25),
('Ku nene — lava hi speed ya N1 hi ku ya eTshwane nhlikanhi.', 'ts', 'traffic', 5, 25),
('Sepeile e sa fetela — fast ke taxi ka metsing.', 'st', 'taxi', 5, 25),

-- 25–100 Mbps: lekker
('Lekker! Your speed is braai-ready.', 'en', 'braai', 25, 100),
('Fast enough to download a rugby highlight reel before the Boks score.', 'en', 'rugby', 25, 100),
('Jy kan nou Netflix kyk én WhatsApp op jou Hilux se Apple CarPlay speel.', 'af', 'toyota', 25, 100),
('Pieter is happy. Lerato is happy. The braai is on.', 'en', 'braai', 25, 100),
('Speed ya gago e tla tshwana le Toyota Hilux — e a tsamaya!', 'tn', 'toyota', 25, 100),
('U tshimbila zwavhudi — internet yo naka.', 've', 'general', 25, 100),

-- 100–500 Mbps: fast
('Faster than a taxi overtaking on the shoulder of the N2.', 'en', 'taxi', 100, 500),
('Now your braai broodjies download before they toast.', 'en', 'braai_broodjies', 100, 500),
('Hierdie spoed is vinniger as die Bokke se eerste vyf minute.', 'af', 'rugby', 100, 500),
('Vinniger as ''n Hilux met ''n leë bak.', 'af', 'toyota', 100, 500),
('Mandla — your fibre is absolutely klapping it.', 'en', 'fibre', 100, 500),
('Speed yakho ihamba njenge Toyota Fortuner eyigwilayo.', 'zu', 'toyota', 100, 500),
('Sepeile sa hao se matla — o tshwana le Springbok ya bese.', 'st', 'rugby', 100, 500),

-- 500+ Mbps: Ferrari territory
('Speed of a Ferrari on the M1 at 3am.', 'en', 'cars', 500, 999999),
('Dis nou rerig lekker — jy''s op Stage 0 se internet.', 'af', 'load_shedding', 500, 999999),
('Faster than Cheslin Kolbe on a side-step.', 'en', 'rugby', 500, 999999),
('Eish, Anele — you are the fibre king of Sandton.', 'en', 'fibre', 500, 999999),
('Speed yakho inyuka njengamanani ka-Eskom.', 'zu', 'eskom', 500, 999999),
('Sepeile se matla ho feta Hilux e theoswa ka thaba.', 'st', 'toyota', 500, 999999),
('This is Home Affairs on a good day — blink and it''s done.', 'en', 'home_affairs', 500, 999999),
('Faster than Sipho running to the shops before loadshedding.', 'en', 'load_shedding', 500, 999999),

-- Some extras across buckets
('Gooi die braai vleis aan — jou internet is reg.', 'af', 'braai', 25, 100),
('Ag no man — try reboot your router first.', 'af', 'isp', 0, 5),
('Potholes are smoother than this connection.', 'en', 'potholes', 0, 5),
('Your upload speed is faster than the licensing department''s photocopier.', 'en', 'licensing', 100, 500),
('Lekker, lekker, lekker — ons kan nou Stream en Zoom op dieselfde tyd.', 'af', 'general', 100, 500),
('Speed of a bakkie at a red light: confident.', 'en', 'general', 25, 100);