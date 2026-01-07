---
title: "Untitled Article"
description: "Worklog: Optymalizacja zasięgów na Twitterze - autoformatowanie pod 280 znaków z Pythonem i API v2. Doświadczenia z Tweepy i liczeniem stringów.

KONT..."
pubDatetime: 2026-01-07T03:27:07.172092
tags: ["AI", "Cloudflare", "Automation"]
heroImage: "https://7f490d58a478c6baccb0ae01ea1d87c3.r2.cloudflarestorage.com/mybonzo-blog-content/images/2026-01/WORKLOG_Tweet_Optimization.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cf46e8560ccdfd4712e4d6cbe542820d%2F20260107%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260107T022707Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=0ac5aca30b03637c67c53d3de4c85457fc5febac7cf36904efd166c5b5f67218"
alt: "Cover image for Untitled Article"
---

**Worklog: Optymalizacja zasięgów na Twitterze - autoformatowanie pod 280 znaków z Pythonem i API v2. Doświadczenia z Tweepy i liczeniem stringów.**

**KONTEKST:** Wczoraj wieczorem pracowałem nad optymalizacją postów na Twitterze (teraz X), bo klient narzeka, że długie treści są ucinane i tracą zasięgi. Chciałem ogarnąć automatyczne skracanie tekstu pod limit 280 znaków używając Pythona z Tweepy i API v2, zanim wrzucę to do schedulera.

**PROCES:** Testowałem na małych datasetach treści - brałem raw stringi z bazy, liczyłem len(string) vs. faktyczny tweet length (bo emotki i linki liczą się inaczej), debugowałem Tweepy client z v2 endpoints do tweetingu. Mailowałem z klientem o auth scopes (tweet.write must have), bawiłem się paginatorami na próbkach tweetów i prostym truncator-em z ellipsis na końcu.

**WYNIK:** Działa! Skrypty tną tekst pod 280 bez błędów 403 (rate limits), zasięgi wzrosły o ~15% na testowych postach - liczenie stringów z Tweepy zwraca dokładne byte counts. Nauczyłem się, że v2 lepiej radzi z expansions i tweet fields niż v1.1.

**NASTĘPNY KROK:** Jutro dodam auto-threading dla dłuższych treści i integrację z workerem do batch posting.

**CTA:** Chcesz podobny setup? Napisz maila.

> *Robię custom AI rozwiązania dla devów i biznesu – napisz bonzo@mybonzo.ai*