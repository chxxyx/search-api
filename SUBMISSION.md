## 구현 방법 설명

1. **유저 등록 API (회원)**:
   - 회원 가입 시 유저의 이메일, 비밀번호, 이름 정보를 받아서 회원을 등록하는 API를 구현하였습니다.
   - 유저 정보를 저장하고, 중복된 이메일이 존재하지 않도록 유니크 제약을 두었습니다.

2. **검색어 저장 API (회원, 비회원)**:
   - 회원은 이메일을 통해 식별하고, 비회원은 IP를 통해 검색어를 저장합니다. 
   - `SearchKeyword` 모델에 검색어, 사용자 정보, IP를 기록하며, 중복된 검색어를 저장하지 않도록 유니크 제약을 설정했습니다.
   - 비회원과 회원 각각에 대해 유효한 입력을 검증하고, 적절한 에러 처리 로직을 추가했습니다.

3. **24시간 인기 검색어 조회**:
   - 저장된 검색어 데이터를 기반으로, 지난 24시간 동안 가장 많이 검색된 키워드를 조회하는 API를 구현했습니다.
   - `GROUP BY` 및 `COUNT` 기능을 활용하여, 인기 검색어를 정렬하여 반환합니다.

## 어려웠던 점

- 비회원의 경우 IP를 저장해야 했기 때문에, 비회원의 검색어 저장 로직을 구현하는 과정에서 IP 주소를 적절히 처리하고, 중복되는 IP와 검색어를 방지하는 방법에 대해 고민이 필요했습니다.
  
- `SearchKeyword` 모델에 유니크 제약을 걸었지만 중복된 검색어를 처리할 때 발생할 수 있는 오류를 효과적으로 처리하는 로직을 설계하는 데 어려움이 있었습니다.

## 개선하고 싶은 부분

- 비회원의 경우 IP 주소를 기준으로 검색어를 저장하지만, 같은 IP에서 반복적으로 검색이 이루어질 경우 성능 저하가 발생할 수 있어서 캐싱을 활용하거나, 특정 시간 동안 같은 IP의 검색을 제한하는 기능을 추가하고 싶습니다.

- 테스팅에 대한 학습이 좀 더 필요한 것 같습니다.
- 과제 제출 이후에도 추가적으로 테스팅을 진행할 예정입니다.
