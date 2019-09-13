import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-loading-cmp',
    template: `
        <div *ngIf="isShowLoading">
            <div class="preloader d-flex align-items-center justify-content-center">
                <div class="cssload-container">
                    <div class="cssload-loading"><i></i><i></i><i></i><i></i></div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .preloader {
                background-color: rgba(194, 222, 224, 0.103);
                width: 100%;
                height: 100%;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 9999;
            }
            .preloader .cssload-container {
                display: block;
                width: 97px;
            }
            .preloader .cssload-loading i {
                width: 19px;
                height: 19px;
                display: inline-block;
                border-radius: 50%;
                background: #cb8670;
            }
            .preloader .cssload-loading i:first-child {
                opacity: 0;
                animation: cssload-loading-ani2 0.58s linear infinite;
                -o-animation: cssload-loading-ani2 0.58s linear infinite;
                -ms-animation: cssload-loading-ani2 0.58s linear infinite;
                -webkit-animation: cssload-loading-ani2 0.58s linear infinite;
                -moz-animation: cssload-loading-ani2 0.58s linear infinite;
                transform: translate(-19px);
                -o-transform: translate(-19px);
                -ms-transform: translate(-19px);
                -webkit-transform: translate(-19px);
                -moz-transform: translate(-19px);
            }
            .preloader .cssload-loading i:nth-child(2),
            .preloader .cssload-loading i:nth-child(3) {
                animation: cssload-loading-ani3 0.58s linear infinite;
                -o-animation: cssload-loading-ani3 0.58s linear infinite;
                -ms-animation: cssload-loading-ani3 0.58s linear infinite;
                -webkit-animation: cssload-loading-ani3 0.58s linear infinite;
                -moz-animation: cssload-loading-ani3 0.58s linear infinite;
            }
            .preloader .cssload-loading i:last-child {
                animation: cssload-loading-ani1 0.58s linear infinite;
                -o-animation: cssload-loading-ani1 0.58s linear infinite;
                -ms-animation: cssload-loading-ani1 0.58s linear infinite;
                -webkit-animation: cssload-loading-ani1 0.58s linear infinite;
                -moz-animation: cssload-loading-ani1 0.58s linear infinite;
            }
            @keyframes cssload-loading-ani1 {
                100% {
                    transform: translate(39px);
                    opacity: 0;
                }
            }
            @-o-keyframes cssload-loading-ani1 {
                100% {
                    -o-transform: translate(39px);
                    opacity: 0;
                }
            }
            @-ms-keyframes cssload-loading-ani1 {
                100% {
                    -ms-transform: translate(39px);
                    opacity: 0;
                }
            }
            @-webkit-keyframes cssload-loading-ani1 {
                100% {
                    -webkit-transform: translate(39px);
                    opacity: 0;
                }
            }
            @-moz-keyframes cssload-loading-ani1 {
                100% {
                    -moz-transform: translate(39px);
                    opacity: 0;
                }
            }
            @keyframes cssload-loading-ani2 {
                100% {
                    transform: translate(19px);
                    opacity: 1;
                }
            }
            @-o-keyframes cssload-loading-ani2 {
                100% {
                    -o-transform: translate(19px);
                    opacity: 1;
                }
            }
            @-ms-keyframes cssload-loading-ani2 {
                100% {
                    -ms-transform: translate(19px);
                    opacity: 1;
                }
            }
            @-webkit-keyframes cssload-loading-ani2 {
                100% {
                    -webkit-transform: translate(19px);
                    opacity: 1;
                }
            }
            @-moz-keyframes cssload-loading-ani2 {
                100% {
                    -moz-transform: translate(19px);
                    opacity: 1;
                }
            }
            @keyframes cssload-loading-ani3 {
                100% {
                    transform: translate(19px);
                }
            }
            @-o-keyframes cssload-loading-ani3 {
                100% {
                    -o-transform: translate(19px);
                }
            }
            @-ms-keyframes cssload-loading-ani3 {
                100% {
                    -ms-transform: translate(19px);
                }
            }
            @-webkit-keyframes cssload-loading-ani3 {
                100% {
                    -webkit-transform: translate(19px);
                }
            }
            @-moz-keyframes cssload-loading-ani3 {
                100% {
                    -moz-transform: translate(19px);
                }
            }
        `,
    ],
})
export class LoadingComponent {
    public isShowLoading: boolean;
    constructor(private loadingService: LoadingService) {
        this.isShowLoading = false;
        this.loadingService.loadingSubject.subscribe(value => (this.isShowLoading = value));
    }
}
