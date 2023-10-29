import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDepositedProducts,
  purchaseConfirm,
} from "../../_actions/productAction";
import { setLoadings } from "../../_actions/uiAction";
import {
  getEventsFromWeb3js,
  getEscrowCreateEvents,
} from "../../contract/getEvents";
import DepositReceipt from "../Receipt/DepositReceipt";

import { useSDK, useContract, useAddress } from "@thirdweb-dev/react";

import deleteBtn from "../../assets/icon-delete.svg";
import classes from "../../styles/user/ReservedList.module.css";
import { PropagateLoader } from "react-spinners";
import { Oval } from "react-loader-spinner";
import { closeSnackbar, useSnackbar } from "notistack";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const ReservedList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isContractLoading } = useSelector((state) => state.ui);
  const { userId } = useSelector((state) => state.user);
  const prodDetail =
    useSelector((state) => state.product.depositedProducts?.products) || [];

  const [isLoading, setIsLoading] = useState(false);
  const [lastProdId, setLastProdId] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [displayMore, setDisplayMore] = useState(true);
  const [openDepositReceipt, setOpenDepositReceipt] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const sdk = useSDK();
  const { contract } = useContract(contractAddress);
  const address = useAddress();

  const handleOpenDepositReceipt = () => {
    setOpenDepositReceipt(true);
  };

  const handleCloseDepositReceipt = () => {
    setOpenDepositReceipt(false);
  };

  const handleClick = (func, comment) => {
    if (userId == undefined) {
      navigate("/login");
    } else {
      enqueueSnackbar(comment, {
        variant: "info",
        persist: true, // 자동으로 스낵바를 닫지 않음
        action: (key) => (
          <div>
            <button
              onClick={() => func(key)}
              className={classes.purchaseButton}
            >
              구매확정
            </button>
            <button
              onClick={() => {
                closeSnackbar(key);
              }}
              className={classes.backButton}
            >
              뒤로가기
            </button>
          </div>
        ),
      });
    }
  };

  const handleGetEventsLog = async () => {
    const log = await getEscrowCreateEvents(sdk, "EscrowDeposit", address);
    console.log(log);
    const prodIdLog = log?.map((event) => parseInt(event.data?.productId));
    return prodIdLog;
  }; // map 에러로 인한 임시 주석처리

  const onPurchaseConfirm = (id) => {
    handleClick((e) => purchaseConfirmHandler(id), "구매 확정하시겠습니까?");
  };

  const purchaseConfirmHandler = (id, key) => {
    console.log(id);
    closeSnackbar(key);
    const data = {
      productId: id,
      sdk: sdk,
    };
    enqueueSnackbar("구매 확정이 진행됩니다. 잠시만 기다려주세요.", {
      variant: "success",
    });
    dispatch(purchaseConfirm(data)).then((response) => {
      console.log(response);
      if (response.payload === true) {
        return enqueueSnackbar("구매 확정되었습니다.", {
          variant: "success",
        });
      } else {
        return enqueueSnackbar("구매 확정에 실패했습니다.", {
          variant: "error",
        });
      }
    });
  };

  const onClickMoreProduct = () => {
    setLastProdId(productsList[productsList.length - 1]?.id);
  };

  useEffect(() => {
    setIsLoading(true);
    handleGetEventsLog().then((value) =>
      dispatch(getDepositedProducts({ productIds: value, lastId: lastProdId }))
        .then((res) => {
          const prodListFromDb = res.payload.products ?? [];
          setProductsList([...prodListFromDb]);
          console.log(prodListFromDb);
          //TODO 페이지네이션
          // setProductsList((productsList) => [
          //   ...productsList,
          //   ...prodListFromDb,
          // ]);

          // if (prodListFromDb.length < 12 || prodListFromDb[0]?.id <= 12) {
          //   setDisplayMore(false);
          // }
          setIsLoading(false);
        })
        .catch((err) => console.log(err))
    );
  }, [dispatch, address, lastProdId]);

  // 지갑연결X ? 지갑연결해주세요 :
  // 제품X ? 제품을 구매해보세요:
  // 로딩중O ? 로딩중 : 제품
  return (
    <Fragment>
      {!address ? (
        <div className={classes.notReservedList}>
          <h2>연결된 지갑이 없습니다.</h2>
          <p>지갑을 연결해주세요!</p>
        </div>
      ) : isLoading ? (
        <div className={classes.propagateLoader}>
          <PropagateLoader color="#1ECFBA" />
        </div>
      ) : productsList.length === 0 ? (
        <div className={classes.notReservedList}>
          <h2>구매진행중인 상품이 없습니다.</h2>
          <p>원하는 상품을 구매해보세요!</p>
        </div>
      ) : (
        <div className={classes.reservedList}>
          {productsList.map((product) => {
            console.log(product);
            return (
              // <div className={classes.test}>
              <div key={product.id} className={classes.reservedProductWrap}>
                <div className={classes.reservedProductImage}>
                  <img src={product.image} alt="" />
                </div>

                <div className={classes.reservedProductInfo}>
                  <p className={classes.productCategory}>category</p>
                  <p className={classes.productName}>{product.title}</p>
                  <p
                    className={classes.productPrice}
                  >{`${product.price} PDT`}</p>
                </div>
                {/* </div> */}

                {isContractLoading ? (
                  <div className={classes.oval}>
                    <Oval
                      height={60}
                      width={60}
                      color="#1ecfba"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel="oval-loading"
                      secondaryColor="#1ecfba"
                      strokeWidth={4}
                      strokeWidthSecondary={4}
                      // className={classes["oval"]}
                    />
                  </div>
                ) : (
                  <div className={classes.reservedProductPurchase}>
                    {!product.approve_tx ? (
                      <button
                        onClick={(e) => onPurchaseConfirm(product.id)}
                        className={classes.btnSubmit}
                      >
                        구매확정
                      </button>
                    ) : (
                      <button
                        onClick={(e) => onPurchaseConfirm(product.id)}
                        className={classes.completeApprove}
                      >
                        구매확정완료
                      </button>
                    )}

                    <button
                      onClick={handleOpenDepositReceipt}
                      className={classes.receiptbtn}
                    >
                      구매진행정보
                    </button>
                  </div>
                )}

                <div className={classes.reservedProductRemove}>
                  <img
                    src={deleteBtn}
                    // onClick={() => onDeleteWishListHandler(product.id)}
                  />
                </div>
                <DepositReceipt
                  open={openDepositReceipt}
                  onClose={handleCloseDepositReceipt}
                  txHash={product.deposit_tx}
                />
              </div>
            );
          })}
        </div>
      )}
    </Fragment>
  );
};

export default ReservedList;
