# Cite.GG

보다 쉬운 <읽을 논문거리 찾기>를 위해, Cite.GG

> [Cite.GG](https://cite.gg) 를 방문해보세요!

# 논문 읽어야 하는데... 어떻게 읽지?

아주 잘 알려진 논문들 조차도, 해당 분야에 새로 온 연구자는 <어떤 논문이 유명한지> 조차도 모르는 상황일 가능성이 높습니다.

NLP 분야에서 BERT, GPT와 같은 논문들 조차도 "버트? 들어는 봤는데... 어떤게 어떤거야? 나는 그쪽 분야는 정말 몰라서.. Language Model이 정확히 어떤 개념이야?" 라는 사람에게는 생소한 논문일 수도 있는 것 처럼요.

# 비슷한 논문 추천?

Google Scholar나 Semantic Scholar, 혹은 그 외에 여러가지 논문 검색 서비스들에서는 우리가 검색한/저장한 논문을 기준으로 우리가 관심가질만한 논문을 추천해줍니다.

이 추천을 위해서 수많은 알고리즘과, 최근에는 딥러닝을 사용해 추천을 해주는 시스템도 나오기도 했습니다.

한편, 가장 기본적이지만 직관적인, **"그래서, 다들 인용하는, 다들 읽었지만 나만 안읽었지만 꼭 읽어야 하는 논문은 어떤 논문인데?"** 라는 문제에 대한 답을 하는 서비스는 딱히 없어보이더군요. (있는데 저만 모를수도 있습니다😅)

그래서, 위 문제에 대한 답을 심플하게 찾아보고자 했습니다.

# 내가 지금 읽는 논문과 비슷한 논문들이 공통적으로 인용한 논문은?

(어떻게든 구글 스콜라에서 키워드로 검색해 어떤 논문을 찾아서) 읽고있는 논문이 있다면..

- **이 논문을 인용한 논문**들이 있겠지?
- 이 논문을 인용한 논문들이 **공통적으로 인용한 논문**들이 있겠지!
- **공통적으로 인용된 논문**들의 인용 횟수별로 정렬해보자!

-라는 아이디어를 구현한 서비스 입니다.

즉, 내가 읽고 있는 논문의 후속 논문들은 (아마도) 비슷한, 하지만 중요한 수많은 논문들을 인용했을 것이기 때문이죠.

# 어떻게 동작하나요?

![Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled.png](Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled.png)

[Cite.GG](http://cite.GG)  메인 페이지 검색창

여러분이 [Cite.gg](http://cite.gg) 페이지에 처음 방문하면, 검색창 하나만 덩그러니 있는 모습을 보게 됩니다.

그곳에 예제와 같은 `arXiv` URL, 혹은 `DOI` 번호를 넣어주시면 아래와 같이 해당 논문의 Detail 정보, 그리고 **Common Reference라고 부르는 "우리가 읽을 논문"** 목록이 나타납니다.

![Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled%201.png](Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled%201.png)

BEEP! 논문을 검색한 결과. Abstract를 포함한 정보와 Common Reference, 즉 읽을 논문 목록이 표로 보인다.

각 Table을 클릭하면 해당 논문의 정보로 넘어가게 되고, 논문의 Abstract를 보고서 어떻게 읽을지 고민해보면 됩니다.

위키를 읽을 때 글을 읽다 점핑 - 점핑 해 나가는 느낌으로 이해하시면 될 것 같습니다 🙂

# 추가적인 기능

## History

논문을 찾아서 들어갔는데, 그게 어떤 논문이었는지 까먹으면 곤란하겠죠.

그래서 [Cite.gg](http://cite.gg) 의 각 논문 페이지에 방문시 해당 논문 정보를 여러분의 브라우저에 저장해 둡니다.

[Cite.GG](http://cite.GG) 에서는 어떤 정보도 수집하거나 저장하지 않기 때문에, 여러분의 History는 여러분의 브라우저에만 저장됩니다.
따라서, 다른 기기 혹은 다른 브라우저를 사용시 History는 공유되지 않습니다.

![Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled%202.png](Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled%202.png)

제가 최근에 읽은 논문 History에요.

만약 history를 지우고 싶다면 전체 제거 기능도 있습니다! (아직 하나만 지우는 기능은 없어요. 😅)

# FAQ

## Q. Common Reference가 없어요!

![Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled%203.png](Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled%203.png)

Common Reference가 없고, Citations도 없는 경우

위 그림 처럼 Common Reference도 없고, Citations도 없다면 → 이 논문은 아직 '수집된' citation 정보가 없는 경우입니다.

Common Reference는 이 논문을 인용한 논문의 Reference를 찾기 때문에, 이러한 경우는 당연히도 0개가 됩니다.

## Q. Too many citations라고 떠요!

![Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled%204.png](Cite%20GG%20cf0d1f83dd264526b4f1ba2907a7f221/Untitled%204.png)

말 그대로 해당 논문은 "너무 많이 인용된" 논문입니다.

이러한 논문은 사실상 도메인에 있어서 기본적인 논문이기 때문에, 이 논문을 인용한 논문간 공통성은 오히려 너무 넓어서 의미가 없을수 있어, 기본값은 500이지만 연구자분들의 취향에 따라 2000까지 조회할 수 있도록 기능을 넣어두었습니다. (*우측의 Query Limits를 살펴보세요)

## Q. Common Reference가 안떠요! (혹은 주황색 Timeout이 떠요!)

이러한 경우는 Reference Graph를 그리는 DB서버가 죽었을 경우입니다.

조회한 논문의 metadata(title, abstract, author, citations, references)의 경우 SemanticScholar API를 통해 조회하지만, Common Reference는 직접 작성한 백엔드 서버에서 동작하기 때문에, 해당 서버에 이슈가 생긴 경우 Common Reference가 동작하지 않는 문제가 발생합니다.

이 경우는 jun@beomi.net 메일로 알려주시면 가능한 빠르게 문제를 확인해볼 수 있습니다 🙂