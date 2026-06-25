<template>
  <div style="display: contents">
    <div
      class="newcodesidebar toolbar-sidebar desktop-gallery"
      v-if="$ctx.rightPanel"
    >
      <div class="gallery-container">
        <div class="examples-container">
          <template v-if="randomExamples.length > 0">
            <div
              v-for="(example, index) in randomExamples"
              :key="index"
              class="example"
              @click="loadModel(example.url)"
            >
              <img :src="`/examples/${example.name}.jpg`" :alt="example.name" />
            </div>
          </template>
          <template v-if="randomExamples.length === 0">
            <div class="example"></div>
            <div class="example"></div>
            <div class="example"></div>
            <div class="example"></div>
          </template>
          <div class="example random" @click="handleRandom()">
            <icons-random />View Random
          </div>
        </div>
        <div
          class="stats random"
          style="margin-top: auto"
          @click="handleRandom()"
        >
          <div class="zoom-control">
            <div class="hoveredArea">{{ $ctx.hoveredArea }}</div>

            <div>voxels: {{ $ctx.voxelLength }}</div>
            <div>facets: {{ $ctx.facets }}</div>
            <div>
              size: ~{{ $ctx.size }}
              KB
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="newcodesidebar toolbar-sidebar mobile-gallery"
      v-if="$ctx.rightPanel && $ctx.openMenu"
    >
      <div class="gallery-container">
        <div class="examples-container">
          <template v-if="randomExamples.length > 0">
            <div
              v-for="(example, index) in randomExamplesMobile"
              :key="index"
              class="example"
              @click="loadModel(example.url)"
            >
              <img :src="`/examples/${example.name}.jpg`" :alt="example.name" />
            </div>
          </template>

          <template v-if="randomExamples.length === 0">
            <div class="example"></div>
            <div class="example"></div>
            <div class="example"></div>
            <div class="example"></div>
          </template>
          <div class="example random" @click="handleRandom()">
            <icons-random />View Random
          </div>
        </div>
        <div
          class="stats random"
          style="margin-top: auto"
          @click="handleRandom()"
        >
          <div class="zoom-control">
            <div class="hoveredArea">{{ $ctx.hoveredArea }}</div>

            <div>voxels: {{ $ctx.voxelLength }}</div>
            <div>facets: {{ $ctx.facets }}</div>
            <div>
              size: ~{{ $ctx.size }}
              KB
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      gallery: [], // Stores the fetched gallery data

      retools: ["add", "fill", "paint", "erase"],
      exporttools: ["web", "csv", "json", "about"],
      bottomtools: ["grid", "camera", "config", "about"],
      cubeShapes: ["cube", "slab", "wedge", "spike"],
      examples: [
        {
          name: "apple",
          url: "eJyNUUsOwiAQvVBJHgzMDLBRk3oGXXsDV2p6eEOhLY2J6Ya8zPtNBlgjAgDDI4GSDzzAJ!KBZUBYAC9AimKC25loJkiyCgSuDF1NWgPd7NcSuULeoFSd1nQyfVBJp-RmVXm1NJ2BK3TX1DY80NWUrc2bPqxxtOkPBK5Qq39C6EIPXjVfYCPGnzXaDrW-NrfSXSObzd8d409nM4rxo9X6lyGFCWqgHJcB-QyVlXc5sI2dOpqeJr!j-fRCfCN-EJ83lufdhy-q34X0",
        },
        {
          name: "appleHalf",
          url: "eJyFkUtuwzAMRC9kASPxK2vTxHHP0K57g6zaQocvFLu2hADtTgQ5b6ghYjADgOljBs0sOoFnYlGbINujIg1DZMUNhtTKtGkOaXpIvIkTmZdbvEa7tEmZpay3ZfG9Yq2g0JPIGih5uQCv8AG!rzQajHgWLWtcotNWk1VwEI1527xZDuidSSfzL7w8wSWctDG7ckXMWJ9sdo!!8axDVs1Nu6za-GnRpdNdrh3OAq!Rf78vFR7geuRBXOB29FPpw5KKHPo28dDXl0!kL-g38v1N7f7O8gNpmoKy",
        },

        {
          name: "cat",
          url: "eJyNkkFSQzEIhi-UzECAJC9vY23rGXTtDbpSJ4d3IGkl2nH6FmHygO-HAGA804GphPcGqVEAaiQBuElAaBQQ9Y6pSYcUX2o-4rPGksZaFGqU-cmx7vk5nuxTvzQOkPUoelQ9tsYqyprD-42ldew!ymwFaVkdxBFJEewTRyhIIxYVM1OGqcNsZlSBB5StWe6QV!RKZY!lG3T7jXFlZ6ulOr0O5UGNx!D8h1-jJ7rw0eK2zJ519olYsj5jmvrzh-JNMi-TyB3B9ZCWHpJ1!D9zpakC5Y4YhQ!nBHORZPd7ZVMmvj6OpsiCmRPEFO-kzUftSHHdk6cPKJ9IX0iX1wKXt4TlGwrbrxQ",
        },
        {
          name: "snowman",
          url: "eJzNVFtOxDAMvFAr2c7LSX8QQpwBPqGcYL8A7eGRm5Q4S7fVrnZFG6n1qPbMxHkA9s!T040JOAWOHcTkA8e3DmEOcA5IMo5AqiiUf8DJTdG7MMwhQg2xhlRDk-uPYBSpn0lDJeVkSzyKQgUIGqAGpIGponYWtUrU5en7Khm05Im--UUf4qCB2MITFwrYasnl1rrGUOnCeUta51JTDTxvq3TK9-RldGNCSDTs1GbYa!94bzst!sN5Q7jDzYHX3GGo77A4FSHkD-YE09tHw8iSQIk75MSDFiruV6WKQ6u4jHCFhitk04pyswtFwWSvrjmcdqhqNnEHTl5edAWiQPS3deDvPMNww9XgraWPSwleZRBcseVI9ql7AsirJAd3WGNZJqG61JI8JSzR!PHSsJiNFpDtA8q4tLnkVOEis19PePhE-4Xxm!zhxcfDK8X4A9wNEUA",
        },

        {
          name: "pumpkin",
          url: "eJx9k0luwzAMRS!kANTAQcymCJI7tEunN8iqLXT4gpIHyXa8SQia5H!il8BdXCLwMHwrRPUDsIarB374m6WChgHQ8mSR2E!SeL0Jepia0Jrwer8T11RQYkkDxPI!2gCcIloinj9KCTL4yyrbS3glq4-NhNeiEJZxUWMNnya3xtTErEsoS2Oa5MOJPJYzlLandaB0KDSxrEqHNFuY2NDEFieNGWLji2jocKQIFJKxA0Hr3ZLgYsK7rRyA1GPWzWCzGd6gIKcybe8PyY7knUPHBu1IxgzUoFCHMtmDVn3szulNOVtJ60wGbozpEeza28h6zW1Kvd2pexr1YaymYOWjWYbnjChLBmnkUEmsklPzQqOy2JxqRLAKLp2p35VkB13Gjvjx4!yvgz8Hr0!i15cj!geh2Ozs",
        },
        {
          name: "curry",
          url: "eJytkkFSwzAMRS-UzkiWJdnqhgbKGWCZ5gZdAZPDdySX1GHaBQybxJrE!z99CXDHlRhehtmAjEVLHSBbjtM0ABtdz6cBpC-0L0pf1K5AWLUQm!4CqTNNJloGoJtlNjqFcTgmmt0rXqW9qn9CiCfe5ENp!yxJAVx508V6FOtb6DvoG1hFV!wFaEN9jeoOd5qDu2E36oBO813oOD3C!q!wF8g7qZkRftL!FrxjHilRYyYrLiOBzBoxV5fx0RbLEakEUIk92I!HCjz6XTX2f3gTgq9iW8R1gNIyKJPrtq5FW8OsJXqV6uKxBa8HkIMrsaPF0GPe4mrFJr9Xp!1RKX07qvuxe1W!oS1mF!aOEK0uwA924O8pPn0gfSJ9AZ!fuJzfRS97cM8c",
        },

        {
          name: "chair",
          url: "eJxlU0uOWzEMu5AHkPWxLWVTTNE5w8zS6A1m1Rbv8IXklzwr2QTIM0mRtAz1TX5Sw1!ltwEZlQqGOm!yQR0!!CMaFSDDUqvhvLV6HaBOP9LpLHIA6QG4KaLRjvHfapTl8ZSHc4ZuM05HdAAlVaQHaS5S1pwrR0xLltV5dDo-gJ9V70GQdBN8UEIxl7DyLf!zAMl9shZgGwXUaDiGk-zwU8eoS4ONPTx782p8em1JuTmTuBcQ6wWaETct0I1ECwxrPVRbDJWeprL0GCzN2eGxmX!qLjuMJfxmL0MdLG04WBzLThmey11Kj3htHNDzBjiMDGdkjZHYY6TPGYbd-ci6KvSGW0-3KbFBTkfpYYPbdAFckePfMInE0tblxlXxSHcVFflOAduMOJF8usiSHktMrcfuiN46MpOexa3EEXgV2269c6P3dS7rVkbUGkVRtEqrqGg1WurjgPF2ZRSLBHmzoop5gG513oFrD9PKHxVS7y-Kcles9Rr9ss!Ry-IeFTePr!Y2xf15jmdnAby4i8E51fPzzbboERucmx!ZGfQS4EcIfVD219MSOnmDfsr9-FPr34r!avv-bPz9RVD!A4gkKcA",
        },
        {
          name: "anvil",
          url: "eJyVkcEOwiAMhl-IJd2AAvVi4kvocZvzAXZSw8ObwnBtYozCpX!b7yct0He2HDMTOIrJgCecDCDFdLCRL5cseZxmA44wjBM3hZhGbqs6lHqG4Tc7YbO7ZLB!01Hi7gP-jfaoed!JgUuxzuzfsSe3CxSF0PozYKf3VvNXNrJOSK8lahl2MkMQk1XL6sYmQ0UboT6t4MtNzlCkepoTqOuhkRmieloYFpuCSkAtuua4r0W4RRlS5-yQALhzoMWApbKi-RBOfKvDuMFMbnuejvceHxCfkNYz-vVi-!QCFAqwew",
        },
        {
          name: "cup",
          url: "eJyllEtu4zAMhi!kABRfkqXNoI5zhum6N-iqM!DhByRlV7FnBii6SiLx8f1!KEK68YqP9DK9VZAqeQKtxKJ5glzZPor9zmWCufp5giq5yUw5PSKL1bKKZZAUy1CLpmKxrBvgjRRXVAvnqAJSia2qVqQyD!G50Z0YnShXnK0ezo2FFkp2ONthgkql8cpMZXqrKXnZpsqI3MU41q7FRZUuR096dAO6fUqiKhNwDUorMlsFtNAyWaumie6IgRiETmSXIwSZE-wk0kn06H9lChvi0KxwvFS15cQFc7fPaoVxU!ciVdmABwEYAuSiwBIOGTrIkPj!Tlp4FMP1SQZ-SccgAcMUtqAdXgZ4Nngn7vcj50l!6fp54OziNWbsYjoejOMo4Cfu!i3ZnF-w8wZ6hnWPu72haCDGkBMzG-OjT7Thxn9H5N-wJ2!70JbdmX0mN8hP0P4kcO7z8AxMF2C9jjSLHmp5ABB7xqfm7QV4AejLIgRaf9dS-kJZktAe4!3NkVzzsU7EArXdk6x7nMaScnPEXzK3FVXiXquEhXbP3oy0PR7Lohr37oL4JsgblL9vqRi1-Rtb6cdHgl8Jf0N5!ynl!VXzH-l5KMg",
        },
        {
          name: "coin",
          url: "eJyNlMtu2zAQRX9IBfiaB0eb2pb9De2SD8n7rNqiH19c0kjgoEGysWSKPLwcHtL5bycnwV-WZi6aLi4Zt744wrsYy-KyaVm8s754b7UtPlg8Fh-NF58s7Ysn47Z4Ni3r6SRnv02a5FIBJODSvjjGq5qCpuAAHC1KOYDKIFEHSXJdz0mjvwGVTBQMQjK2hmTUgYoH8iUWIBMjYQIhWKo72BXgsp6vegl-shCKrIKUat8Bi2k!gEvEsoMY6QAxkuwHoBGPYK2DiRgemep60ZxCBFct3DEk3Nct5C2kOVnGXCwFs4R2BxsP76yAG!gOoq7b5USBMWZUxUWU1KVH2aKWA4SKkKWDguV5E6QiIBIiUUMJNa-32yU61M4n445GqWhUf0UjWcG!LWxzRskVU9LY-Lm5-3q7bUkCOjA88MFY0KgyRhHWxvgR04xgGbky1paRTTPGZMAQaDurYJxYQeeKfhX9EGW7Zj-r2ADp-Nj-uvBkZxkyoS5ko6C1vdlJQM2YcwHtMzs1Dzv7m51DqfLYnFc7tX5m5zSKeNjJ7-2sbR!LGRtGfR92yrBTANYnO6fpMuwkebaztj7t7NPOVPu0Mw07iYedPO0sX7VT6zhQUBF28v1xPP00NVr5op2CkKTjRMq4LJBqHJl9eRUxlyc7p7Lv7NTP7ExPds5LqbYP7MzlP3bm8oGdis7jPhlr0Cc7GRDCR!7-y8tvL39cePlB9PIz8T9J0T2v",
        },
        {
          name: "robot",
          url: "eJyNkUESwiAMRS8EMyEJFNKNtaNn0LU36EodDu-kBYW66WSGxefz8hPA2XPUMg8BEjIQhDKgvcxavUp2ilqqsqpeaPwZUSUSJDbAgqz3eoZNGhTBTbvq!7dv7nGXobYsafwetX9Sg9CGpholQ2jGq9QMgz32Otp2Zg1L8jX74vZrynUQ5PE6pxi4gFdQhtRjiE3XtQOVBWp7B8diuvZndWEOe-H0hPCC-Ha43Ia43DGlDyTIdcM",
        },
        {
          name: "dog",
          url: "eJxtkEESgzAIRS-kMxgIJHTT3qJdauoFXLUdD98B7Zh0nCwCIfz!AIb-lux0RSEoy1Q6EL9XCE1NvCJlBTzpQUViSXmcyrMDUqR4pLFNufn7c6M-gB1TJQ3WFS45MYE!oXJ2ZdfbVZL3y-WcR9JoYQ3TspgIyxaJslHEigIV3aaiCCqmzSmPBww6DaW8T9PibDQkZyh!JDuIcXDfjF5ttlnr-VIrANvD5ju74byC9PU8ZI7UdJCPc30N8Q3pA7LcmZcHQvwCwSOHwg",
        },
        {
          name: "alien",
          url: "eJy9kUmOwyAQRS9kpKIGjGHTEkrOkKz7BlmlWxy-VQVOiDMtWoqRwKrhv08B3iHomr4TcKIJ5kQV0O2KLo2SRtfUBFHzNHSJRkOiTFDK3lrwtmVJlNm-i15MlEcEsjbwBGK!wfbZ9piQ876UAt0kVmC3gV1NrnaudpuBf9Dko7Qw0O4ZQ3W3gmT6-Ayg6UUfbb4VtnqyerJ64grRESyxrA9vyqKFonWiZWLX5OG5KaE5aJLYNLGJ2hH1XovzoKtf1JJ5pD2FbVht9g9YHUXVw2vWPWZD4HcIrt4Po9JBSpvkQym0tKiT0O1YxKS-zhB-PPx6fzqEcDoSyB9h58Zx",
        },
        {
          name: "planter",
          url: "eJzVkUsKAjEMhi9kIZ08pk03asEz6NobzErFw0uaibgQV7qQQvt1mPwPCjntiq3NWWHSCYllAxhAARwgAXNACagrZAjIAavyHaYkhABgdqhIbB7jYGVTZ1MeH4ofVdEU0dSQuNVSi5DNsyLZiO1Vie034va-j5fxJl7DO3gBT-!RPfdraPzH0JQQhCL0iEk2NhzxB4b82ZDJ1jcNJe0LPJ-FW-9hX5TboffuN8thEbYXmK8ZbyDLUWA5ET0AYOigog",
        },

        {
          name: "policeman",
          url: "eJydk0tqxDAMhi8Ugxy9!NgUDHOGdt0bzKotPnyR7U6cIZlOm4AEkaX!syKBd9Se5T0BJV5AE1dYHYBQDPYVE7EsQN1pd8FcBZzOcY-IubwVxYQkavmoC3Cz0qw2G1o8X0opvc5qFGjmXpIXiEZHDidVzAgxlHIkNmk1KVNistdOa8Km!0h8vtUBCp-ijEqPeXo0Jp6oJK3ZcAAG44T3DFkF-U9!pn-xsazjon9GUDdnbAOkI0lHlo40vY1UcB7s7QNJLZ5jEELoxVqpjX5rpuRLsYOn4NTIj8B!RrpCdLMWn4qx7Ev!1hOqHnZLhf3Wj9aCd3txXr96f7-v-mS!dRo1tnWQhC8fED49fHl!fVW6vq1RvwG9nOSd",
        },
        {
          name: "punk",
          url: "eJzFU0tuwyAQvRBIb4Zh-HhT1VLO0K57g6zayoevBhMHHGXTTWzJY8P7YRiQZ9jtviqkikOqsoE9UHJoo6EGiQ6yl7SXbGVDmHAcohqQ1SFWDmKfentJbTw31HJZ17Vko7GZBnucHcShWBjxAECTSWxiOkpKuw7JUmV5z8bcl8Y9wmA9usa96DnDhvhae32tffIj434StJO0s7TT9Dgb2ROoB5ca2vzjvnfFJ4J3vX4Wir-sKvuqYk2GTcs!ExImMdYmx8!05r-kp1YgGsTEkvUOSEcLpI14At3mH5Fv38g!hF!i60fC9ZNT!gPuDMj4",
        },
        {
          name: "girl",
          url: "eJy9kk1uxCAMhS8Ekg22-cmmkqWcoV33BrNqqxy-MtBmwkzUqVQ1kWICxt97BkAfwF73WkEqOSiVNgi-ZFVVm-UaiR1ID6UFBAsbxENeiCyWGMRBqiGS!eavQbF5hJa1rKpasm0jg7J9ZgI5RBNDfs--Tkw95Hnbsup6LD4J66omSQPG!wkTryoUW!NDZYex8vK3!Ia!T08!0fdzlyFAhgIZEuT7JuTDPYptfTnWB65NWLJiySolS0tWQ2b6MDMknCjYBQxLxd8giU-hbfuN6Ycsbwie2tPF8uw1dnqkU7otIVrf7zb!odbzhnhl-TdH9vQG-R3pA!HynOjyEkr6BOPk3c4",
        },
        {
          name: "mailman",
          url: "eJydU0tuAyEMvRBI9mBjYDaVkHKGdt0bZNVEHL4yMCmgJm0ipPHweR8bA2iZdJjPBD6xgZi4wGYdeIpBVzkRewO-hVgDgoYCbjrnyIsedGJAkiPWaTh-oq4jtOl-U0XsB3DrW6ecc6MkNcT6GdULkH0AjyHnUx7gi63maTI0iY560kJYcucCbB3E0HRCcpVtSeppU9XTq5YMovryU2nIv1aOSqbuiZ-2sSVXQOwI-2kg6UjpUOlYubVUsAg6WkNS3d9z9uSgkTX3lWipWq1ZDJ6ObDWLfTai2N!8H01dINpRje!L8XJH9FdxqCAMbcPHy3h0F7PIff6COFEfzP-oubx9QbiguyKe3308f2xRvgHf0OG1",
        },
        {
          name: "worker",
          url: "eJzFUs1qwzAMfiEbZEuWf3IZGPIM23lv0FNb!PBDdpIqho6xHoohchR9P5EEznqQY74LUCEDsVADb3Nigp7FghQM0AhxhCShAZ7qPAaWQs8GQvFI8sr7JfZ86lXLWmvNSWBeRFEeswIZyGKGbE4io6oxdIVB31klkwspYs0ZRuBZYVnrWnG3f5g!rHKD8FZ1ntW17quKalx6OA2i1bSP8fPGzBs1b9x8LESyDuSMdcL-fVnr6Rdm2xv!E3rNnv!ry4FCPu!R1B46rfPR9kevKHBzzmrUDvqDK27Ov4BFhf0d83GFeHNwd3j5jHT58jn-ADe12k0",
        },
        {
          name: "scientist",
          url: "eJy9k9FOwzAMRX8okZzEcVL3hVG0b4Bn!mBPgPrx6Nph7SQmxpCopUZK7HtPnIRSZPvCq1JVDtSVV8qxMQKzrIVroOpD92HCsFKJmRBenedCwjK0iiXPhaZ-XDBVlEMi5XnTFldrGOanBeGWuVSBpwQSzYIU!Lv9J1uej8uyTN3zGcnO53i8EsdvvB874ov3z5aGv9!FrkO8Uo3X!AB0m6lz!9ZZYmXE!zu3eOgIP9-GnHYhsl0nGToyhGQoyfmC9ZgIcXGlNv2sNVBRFLBKg2wLZ1dkN0hJw1awoaR1xzJaMYCu8Gw41o-VptjtcwA2grFY4cB1R1j0Jja5t0OJdg-YNaMu2zHaKV70qjirl!!MZHkp2du8ly7FfSuskkfGTQoyQB7eqL-n!JHS6bnR6aVQ-gQ-1QQw",
        },
        {
          name: "chef",
          url: "eJy9U0luwzAM!JAEUCK15tLA6B-ac3-QUxP48cWIVix1AQIfAgISQXpmaJEkZz3BzGclqWIoVVnJ23OGIcqVJRiSygFZnBmh0!sCm4E8AT1HAH00FKpnCdFQ7E5q8YyPTstSchSAPKgYh6hu0isjVKoMqlxbPKwkdicYsUGv-JNpINn0PIexVK1zKhL5gl8MrxSLrxRLk1jvemtWqL17vXl6t0lYKVtHMB0GbvnfTd0Y!yHc-bZyytFyHA1I6AGgz6WvNQ3vTq3ESqukO6WzfyGeKcYfRvJhpNhxDhqS-96JOumxk-mxlKmNxeblDiggePuifHN0d3L9iOV68SV9AzjO6RI",
        },
        {
          name: "alieneye",
          url: "eJzFk0FuxCAMRS9EJDsBY8imUtQ7dJaTucGs2orDV8YgD5loVKmLhs0X5r98mwRwSgywbe6WgTJFTtf95iB2WWAeTgTZl3oVBZbJ10eqIVN0cqbWHXCmuI54JRfwBxtXn4KTOvlg5ZaqQBgSaUH2aSK!ABk0CZUqlTo1refm-ABdmtlrl1cHoand9RmIjCbZZOouhKxD4oHdmd4sIRvd4MY-ondhq1zfN1nacxjHHwqkaQZZ2q6Xkl!P05yFOW!V4rxI4yVDaEFq9ILwtzSvR!OrLMN4Wir8t-vBx5!r-WuzG7ALsE!N3vf2icsX4jfO9w-i-2VO!AP5nuOO",
        },
      ],
      randomExamples: [],
      randomExamplesMobile: [],
    };
  },
  mounted() {
    this.randomize();
    if (typeof window !== "undefined") {
      this.currentHash = window.location.hash.slice(1);
    }
  },
  methods: {
    handleRandom() {
      const randomExample =
        this.examples[(Math.random() * this.examples.length) | 0];
      history.replaceState({}, "", `#${randomExample.url}`);
      location.reload();
    },

    async loadModel(string) {
      history.replaceState({}, "", location.pathname + "#" + string);
      location.reload();
    },
    randomize() {
      this.randomExamples = this.examples
        .filter((e) => !this.randomExamples.includes(e))
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

      this.randomExamplesMobile = this.examples
        .filter((e) => !this.randomExamples.includes(e))
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
    },

    handleRefresh() {
      this.$set(this.$ctx, "voxels", {});
      this.scale = 0.8;
      this.$ctx.walls.bl = true;
      this.$ctx.walls.br = true;
      this.$ctx.walls.fl = false;
      this.$ctx.walls.fr = false;
      this.$ctx.rotX = 65;
      this.$ctx.rotY = 45;
      window.history.replaceState(null, "", "/");
    },
  },
};
</script>
<style lang="scss">
.gallery-container button {
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  color: #ddd;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #222;
  border-radius: 6px;
}

.gallery-container {
  background: transparent !important;
  max-height: max-content;
  display: flex;
  gap: 6px;
  flex-direction: column;
  min-width: 152px;
  max-width: 152px;
  .examples-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    background: transparent;
    min-height: 140px;

    > div {
      flex: 1;
      background: #111;
      border: 2px solid #222;
      height: 140px;
      min-height: 140px;
      min-width: 152px;
      max-width: 152px;
      border-radius: 6px;
      display: block;
      cursor: pointer;
      position: relative;
      &.random {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
        color: #888;
        &:hover {
          color: #eee;
          svg {
            fill: #eee;
          }
        }
        svg {
          width: 32px;
          height: auto;
          fill: #888;
        }
      }
      &:hover {
        border: 2px solid #333;
      }
      img {
        position: absolute;
        inset: 0;
        height: 100%;
        margin: 0 auto;
      }
    }
  }
}
.stats {
  flex: 1;
  background: #111;
  border: 2px solid #222;

  min-width: 152px;
  max-width: 152px;
  border-radius: 6px;
  display: block;

  cursor: pointer;
  position: relative;
  display: flex;
  display: none;

  flex-direction: column;
  padding: 5px 10px 10px;
  gap: 10px;
  font-size: 13px;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  color: #888;
  position: fixed;
  right: 5px;
  bottom: 5px;
  &:hover {
    color: #eee;
    svg {
      fill: #eee;
    }
  }
  svg {
    width: 32px;
    height: auto;
    fill: #888;
  }
  .zoom-control {
    z-index: 999;
    color: #666;
    display: flex;
    gap: 10px;
    font-size: 12px;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    height: auto !important;
    gap: 0;
    padding-top: 5px;
    padding-left: 2px;
    align-items: initial !important;
    justify-content: space-between;
    flex-direction: column;
    line-height: 18px;
    z-index: 999;
    input {
      max-width: 80px;
    }

    > div {
      display: flex;
      position: relative;
    }
  }
}

code[class*="language-"],
pre[class*="language-"] {
  text-shadow: none;
  background: transparent;
  color: #ce9178;
  padding: 0;
  font-size: 13px;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  max-height: 240px;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
  color: #9cdcfe;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #d7ba7d;
}

.token.function {
  color: #ce9178;
}

span.token.tag {
  color: #569cd6;
}

span.token.attr-name {
  color: #9cdcfe;
}

span.token.attr-value {
  color: #d7ba7d;
}

.token.punctuation {
  color: #ddd;
}

pre[class*="language-"]::-moz-selection,
pre[class*="language-"] ::-moz-selection,
code[class*="language-"]::-moz-selection,
code[class*="language-"] ::-moz-selection {
  text-shadow: none;
  background: #444;
}

pre[class*="language-"]::selection,
pre[class*="language-"] ::selection,
code[class*="language-"]::selection,
code[class*="language-"] ::selection {
  text-shadow: none;
  background: #444;
}

.newcodesidebar {
  z-index: 999;
  color: #eee;
  position: relative;
  max-width: 152px !important;
  min-width: 152px !important;
  flex: 1;
  overflow: auto;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  > button {
    max-height: max-content;
    font-size: 13px;
    text-shadow: none;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    color: #ddd;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #222;
    border-radius: 6px;
    flex-direction: row-reverse;
    gap: 5px;
  }
  .resection {
    flex: 1;
    overflow: auto;
    background: #212121;

    //max-height: 370px;
  }
}

button[disabled] {
  opacity: 0.8;
}
</style>
